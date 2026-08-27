document.addEventListener("DOMContentLoaded", () => {

    const canvas = new fabric.Canvas("designCanvas", {
        width: 1080,
        height: 1080,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true
    });

    let productDataUrl = null;
    let processedProductDataUrl = null;

    let backgroundRemover = null;
    let aiLoading = false;

    let history = [];
    let historyIndex = -1;
    let restoring = false;


    // ==========================================
    // STATUS
    // ==========================================

    function showStatus(message) {

        let box =
            document.querySelector(".editor-status");

        if (!box) {

            box = document.createElement("div");

            box.className = "editor-status";

            Object.assign(box.style, {
                position: "fixed",
                left: "50%",
                bottom: "80px",
                transform: "translateX(-50%)",
                background: "#171827",
                color: "#ffffff",
                padding: "11px 17px",
                borderRadius: "9px",
                fontSize: "12px",
                fontWeight: "700",
                zIndex: "99999",
                boxShadow: "0 8px 25px rgba(0,0,0,.2)"
            });

            document.body.appendChild(box);
        }

        box.textContent = message;

        clearTimeout(box.timer);

        box.timer = setTimeout(() => {
            box.remove();
        }, 3500);
    }


    // ==========================================
    // HISTORY
    // ==========================================

    function saveState() {

        if (restoring) return;

        const state =
            JSON.stringify(canvas.toJSON());

        history =
            history.slice(
                0,
                historyIndex + 1
            );

        history.push(state);

        historyIndex =
            history.length - 1;

        if (history.length > 30) {
            history.shift();
            historyIndex--;
        }
    }


    function restoreState(state) {

        restoring = true;

        canvas.loadFromJSON(
            JSON.parse(state),
            () => {

                canvas.renderAll();

                restoring = false;
            }
        );
    }


    // ==========================================
    // UNDO
    // ==========================================

    document
        .getElementById("undoBtn")
        ?.addEventListener("click", () => {

            if (historyIndex <= 0) return;

            historyIndex--;

            restoreState(
                history[historyIndex]
            );
        });


    // ==========================================
    // REDO
    // ==========================================

    document
        .getElementById("redoBtn")
        ?.addEventListener("click", () => {

            if (
                historyIndex >=
                history.length - 1
            ) return;

            historyIndex++;

            restoreState(
                history[historyIndex]
            );
        });


    // ==========================================
    // PRODUCT ELEMENTS
    // ==========================================

    const uploadButton =
        document.getElementById(
            "productUploadBtn"
        );

    const imageInput =
        document.getElementById(
            "productImageInput"
        );

    const preview =
        document.getElementById(
            "productPreview"
        );

    const removeButton =
        document.getElementById(
            "removeBackgroundBtn"
        );

    const addButton =
        document.getElementById(
            "addProductBtn"
        );


    // ==========================================
    // UPLOAD PRODUCT
    // ==========================================

    uploadButton?.addEventListener(
        "click",
        () => {

            imageInput?.click();

        }
    );


    imageInput?.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files[0];

            if (!file) return;


            if (
                !file.type.startsWith("image/")
            ) {

                showStatus(
                    "Please select an image."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                (event) => {

                    productDataUrl =
                        event.target.result;

                    processedProductDataUrl =
                        null;


                    showPreview(
                        productDataUrl
                    );


                    if (removeButton) {
                        removeButton.disabled =
                            false;
                    }

                    if (addButton) {
                        addButton.disabled =
                            false;
                    }


                    showStatus(
                        "Product image uploaded."
                    );
                };


            reader.readAsDataURL(file);

            imageInput.value = "";

        }
    );


    // ==========================================
    // PREVIEW
    // ==========================================

    function showPreview(
        imageUrl
    ) {

        if (!preview) return;

        preview.innerHTML = "";

        const image =
            document.createElement("img");

        image.src = imageUrl;

        image.alt =
            "Product preview";

        Object.assign(
            image.style,
            {
                width: "100%",
                height: "130px",
                objectFit: "contain"
            }
        );

        preview.appendChild(image);
    }


    // ==========================================
    // REAL BROWSER AI
    // ==========================================

    async function removeBackground() {

        if (!productDataUrl) {

            showStatus(
                "Upload a product image first."
            );

            return;
        }


        if (!window.adsMakerAI) {

            showStatus(
                "AI is still loading. Please try again."
            );

            return;
        }


        if (aiLoading) return;


        aiLoading = true;

        removeButton.disabled = true;
        addButton.disabled = true;

        removeButton.textContent =
            "✨ Loading AI...";


        try {

            /*
             * Load MODNet background remover.
             *
             * The model runs in the browser.
             */

            if (!backgroundRemover) {

                backgroundRemover =
                    await window.adsMakerAI.pipeline(
                        "background-removal",
                        "Xenova/modnet"
                    );

            }


            removeButton.textContent =
                "✨ Removing...";


            const result =
                await backgroundRemover(
                    productDataUrl
                );


            if (!result) {
                throw new Error(
                    "No image returned by AI."
                );
            }


            /*
             * Transformers.js may return a Blob
             * for image output.
             */

            let outputBlob = null;


            if (
                result instanceof Blob
            ) {

                outputBlob = result;

            } else if (
                result?.blob
            ) {

                outputBlob =
                    await result.blob();

            } else if (
                result?.data
            ) {

                const data =
                    result.data;

                const canvasElement =
                    document.createElement(
                        "canvas"
                    );

                canvasElement.width =
                    data.width;

                canvasElement.height =
                    data.height;

                const context =
                    canvasElement.getContext(
                        "2d"
                    );

                const imageData =
                    new ImageData(
                        data.data,
                        data.width,
                        data.height
                    );

                context.putImageData(
                    imageData,
                    0,
                    0
                );


                outputBlob =
                    await new Promise(
                        resolve => {

                            canvasElement.toBlob(
                                resolve,
                                "image/png"
                            );

                        }
                    );

            }


            if (!outputBlob) {

                throw new Error(
                    "The AI returned an unsupported image format."
                );

            }


            processedProductDataUrl =
                await blobToDataURL(
                    outputBlob
                );


            productDataUrl =
                processedProductDataUrl;


            showPreview(
                processedProductDataUrl
            );


            addButton.disabled =
                false;


            showStatus(
                "Background removed successfully."
            );


        } catch (error) {

            console.error(
                "Background removal failed:",
                error
            );


            showStatus(
                "Background removal failed. Please try another image."
            );

        } finally {

            aiLoading = false;

            removeButton.disabled =
                false;

            removeButton.textContent =
                "✨ Remove Background";

            addButton.disabled =
                !productDataUrl;

        }
    }


    // ==========================================
    // BLOB → DATA URL
    // ==========================================

    function blobToDataURL(blob) {

        return new Promise(
            (resolve, reject) => {

                const reader =
                    new FileReader();

                reader.onload =
                    () => resolve(
                        reader.result
                    );

                reader.onerror =
                    reject;

                reader.readAsDataURL(
                    blob
                );
            }
        );
    }


    // ==========================================
    // REMOVE BACKGROUND BUTTON
    // ==========================================

    removeButton?.addEventListener(
        "click",
        removeBackground
    );


    // ==========================================
    // ADD PRODUCT TO DESIGN
    // ==========================================

    addButton?.addEventListener(
        "click",
        () => {

            if (!productDataUrl) {

                showStatus(
                    "Upload a product image first."
                );

                return;
            }


            fabric.Image.fromURL(
                productDataUrl,
                (image) => {

                    if (!image.width ||
                        !image.height) {

                        showStatus(
                            "Unable to load product image."
                        );

                        return;
                    }


                    const maxWidth = 650;
                    const maxHeight = 600;


                    const scale =
                        Math.min(
                            maxWidth /
                                image.width,

                            maxHeight /
                                image.height
                        );


                    image.set({

                        left:
                            (
                                canvas.width -
                                image.width *
                                scale
                            ) / 2,

                        top: 250,

                        scaleX: scale,

                        scaleY: scale,

                        cornerColor:
                            "#7135f2",

                        cornerStrokeColor:
                            "#7135f2",

                        borderColor:
                            "#7135f2",

                        transparentCorners:
                            false

                    });


                    canvas.add(image);

                    canvas.setActiveObject(
                        image
                    );

                    canvas.renderAll();

                    saveState();


                    showStatus(
                        "Product added to design."
                    );

                },

                {
                    crossOrigin:
                        "anonymous"
                }
            );

        }
    );


    // ==========================================
    // HEADLINE
    // ==========================================

    function addHeadline() {

        const text =
            new fabric.IText(
                "YOUR PRODUCT",
                {

                    left: 70,
                    top: 70,

                    fontSize: 58,

                    fontFamily:
                        "Arial",

                    fontWeight:
                        "bold",

                    fill:
                        "#ffffff",

                    cornerColor:
                        "#7135f2",

                    borderColor:
                        "#7135f2",

                    transparentCorners:
                        false

                }
            );


        canvas.add(text);

        canvas.setActiveObject(text);

        canvas.renderAll();

        saveState();

        text.enterEditing();

    }


    document
        .getElementById("textBtn")
        ?.addEventListener(
            "click",
            addHeadline
        );


    document
        .getElementById("addHeadlineBtn")
        ?.addEventListener(
            "click",
            addHeadline
        );


    // ==========================================
    // PRICE
    // ==========================================

    document
        .getElementById("addPriceBtn")
        ?.addEventListener(
            "click",
            () => {

                const price =
                    new fabric.IText(
                        "₦35,000",
                        {

                            left: 70,
                            top: 760,

                            fontSize: 48,

                            fontFamily:
                                "Arial",

                            fontWeight:
                                "bold",

                            fill:
                                "#ffffff"

                        }
                    );


                canvas.add(price);

                canvas.setActiveObject(price);

                canvas.renderAll();

                saveState();

            }
        );


    // ==========================================
    // WHATSAPP
    // ==========================================

    document
        .getElementById("addPhoneBtn")
        ?.addEventListener(
            "click",
            () => {

                const phone =
                    new fabric.IText(
                        "WhatsApp: 0800 000 0000",
                        {

                            left: 70,
                            top: 850,

                            fontSize: 28,

                            fontFamily:
                                "Arial",

                            fill:
                                "#ffffff"

                        }
                    );


                canvas.add(phone);

                canvas.setActiveObject(phone);

                canvas.renderAll();

                saveState();

            }
        );


    // ==========================================
    // BACKGROUND
    // ==========================================

    const backgroundColor =
        document.getElementById(
            "backgroundColor"
        );


    backgroundColor?.addEventListener(
        "input",
        () => {

            canvas.backgroundColor =
                backgroundColor.value;

            canvas.renderAll();

            saveState();

        }
    );


    document
        .getElementById(
            "resetBackgroundBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                canvas.backgroundColor =
                    "#ffffff";

                if (backgroundColor) {
                    backgroundColor.value =
                        "#ffffff";
                }

                canvas.renderAll();

                saveState();

            }
        );


    // ==========================================
    // DELETE
    // ==========================================

    function deleteSelected() {

        const active =
            canvas.getActiveObject();

        if (!active) return;

        canvas.remove(active);

        canvas.discardActiveObject();

        canvas.renderAll();

        saveState();

    }


    document
        .getElementById(
            "deleteObjectBtn"
        )
        ?.addEventListener(
            "click",
            deleteSelected
        );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Delete" &&
                !event.target.matches(
                    "input, textarea"
                )
            ) {

                deleteSelected();

            }

        }
    );


    // ==========================================
    // LOGO
    // ==========================================

    const uploadLogoBtn =
        document.getElementById(
            "uploadLogoBtn"
        );

    const logoInput =
        document.getElementById(
            "logoInput"
        );


    uploadLogoBtn?.addEventListener(
        "click",
        () => {

            logoInput?.click();

        }
    );


    logoInput?.addEventListener(
        "change",
        () => {

            const file =
                logoInput.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                (event) => {

                    fabric.Image.fromURL(
                        event.target.result,
                        (logo) => {

                            logo.scaleToWidth(
                                180
                            );

                            logo.set({
                                left: 70,
                                top: 920
                            });


                            canvas.add(logo);

                            canvas.setActiveObject(
                                logo
                            );

                            canvas.renderAll();

                            saveState();

                        }
                    );

                };


            reader.readAsDataURL(file);

            logoInput.value = "";

        }
    );


    // ==========================================
    // ELEMENTS
    // ==========================================

    document
        .getElementById(
            "elementsBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                const circle =
                    new fabric.Circle({

                        left: 430,
                        top: 420,

                        radius: 70,

                        fill:
                            "#7135f2"

                    });


                canvas.add(circle);

                canvas.setActiveObject(
                    circle
                );

                canvas.renderAll();

                saveState();

            }
        );


    // ==========================================
    // TEMPLATES
    // ==========================================

    document
        .getElementById(
            "templatesBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "templates.html";

            }
        );


    // ==========================================
    // MOBILE
    // ==========================================

    document
        .getElementById(
            "mobileTemplatesBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.href =
                    "templates.html";

            }
        );


    document
        .getElementById(
            "mobileUploadBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                uploadButton?.click();

            }
        );


    document
        .getElementById(
            "mobileTextBtn"
        )
        ?.addEventListener(
            "click",
            addHeadline
        );


    document
        .getElementById(
            "mobileElementsBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                document
                    .getElementById(
                        "elementsBtn"
                    )
                    ?.click();

            }
        );


    document
        .getElementById(
            "mobileMoreBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                showStatus(
                    "More editing tools coming soon."
                );

            }
        );


    // ==========================================
    // DOWNLOAD
    // ==========================================

    document
        .getElementById(
            "downloadBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                canvas.discardActiveObject();

                canvas.renderAll();


                const dataUrl =
                    canvas.toDataURL({
                        format: "png",
                        quality: 1,
                        multiplier: 1
                    });


                const link =
                    document.createElement(
                        "a"
                    );


                link.download =
                    "ads-maker-free.png";


                link.href =
                    dataUrl;


                link.click();

            }
        );


    // ==========================================
    // CANVAS EVENTS
    // ==========================================

    canvas.on(
        "object:modified",
        saveState
    );


    // ==========================================
    // INITIALIZE
    // ==========================================

    canvas.renderAll();

    saveState();

});
