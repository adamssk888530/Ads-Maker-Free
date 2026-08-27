document.addEventListener("DOMContentLoaded", () => {

    const canvas = new fabric.Canvas("designCanvas", {
        width: 1080,
        height: 1080,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true
    });

    let productDataUrl = null;

    let history = [];
    let historyIndex = -1;
    let restoring = false;


    // ==========================================
    // STATUS MESSAGE
    // ==========================================

    function showStatus(message) {

        let box = document.querySelector(".editor-status");

        if (!box) {

            box = document.createElement("div");

            box.className = "editor-status";

            box.style.position = "fixed";
            box.style.left = "50%";
            box.style.bottom = "80px";
            box.style.transform = "translateX(-50%)";

            box.style.background = "#171827";
            box.style.color = "#ffffff";

            box.style.padding = "11px 17px";

            box.style.borderRadius = "9px";

            box.style.fontSize = "12px";
            box.style.fontWeight = "700";

            box.style.zIndex = "99999";

            document.body.appendChild(box);
        }

        box.textContent = message;

        clearTimeout(box.timer);

        box.timer = setTimeout(() => {

            if (box) {
                box.remove();
            }

        }, 3000);
    }


    // ==========================================
    // HISTORY
    // ==========================================

    function saveState() {

        if (restoring) {
            return;
        }

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


    document
        .getElementById("undoBtn")
        ?.addEventListener("click", () => {

            if (historyIndex <= 0) {
                return;
            }

            historyIndex--;

            restoreState(
                history[historyIndex]
            );

        });


    document
        .getElementById("redoBtn")
        ?.addEventListener("click", () => {

            if (
                historyIndex >=
                history.length - 1
            ) {
                return;
            }

            historyIndex++;

            restoreState(
                history[historyIndex]
            );

        });


    // ==========================================
    // PRODUCT IMAGE
    // ==========================================

    const productUploadBtn =
        document.getElementById(
            "productUploadBtn"
        );

    const productImageInput =
        document.getElementById(
            "productImageInput"
        );

    const productPreview =
        document.getElementById(
            "productPreview"
        );

    const removeBackgroundBtn =
        document.getElementById(
            "removeBackgroundBtn"
        );

    const addProductBtn =
        document.getElementById(
            "addProductBtn"
        );


    productUploadBtn?.addEventListener(
        "click",
        () => {

            productImageInput.click();

        }
    );


    productImageInput?.addEventListener(
        "change",
        () => {

            const file =
                productImageInput.files[0];

            if (!file) {
                return;
            }


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


            reader.onload = (event) => {

                productDataUrl =
                    event.target.result;


                productPreview.innerHTML = "";


                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    productDataUrl;

                image.alt =
                    "Product preview";


                image.style.width =
                    "100%";

                image.style.height =
                    "130px";

                image.style.objectFit =
                    "contain";


                productPreview.appendChild(
                    image
                );


                removeBackgroundBtn.disabled =
                    false;

                addProductBtn.disabled =
                    false;


                showStatus(
                    "Product image uploaded."
                );

            };


            reader.readAsDataURL(file);

            productImageInput.value = "";

        }
    );


    // ==========================================
    // REAL BACKGROUND REMOVAL
    // ==========================================

    removeBackgroundBtn?.addEventListener(
        "click",
        async () => {

            if (!productDataUrl) {

                showStatus(
                    "Upload a product image first."
                );

                return;
            }


            removeBackgroundBtn.disabled =
                true;

            addProductBtn.disabled =
                true;


            removeBackgroundBtn.textContent =
                "✨ Removing Background...";


            try {

                const response =
                    await fetch(
                        "/api/remove-background",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    image:
                                        productDataUrl
                                })
                        }
                    );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.success ||
                    !result.image
                ) {

                    throw new Error(
                        result.error ||
                        "Background removal failed."
                    );

                }


                // Replace original image
                productDataUrl =
                    result.image;


                // Update preview
                productPreview.innerHTML = "";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    productDataUrl;


                image.alt =
                    "Background removed product";


                image.style.width =
                    "100%";

                image.style.height =
                    "130px";

                image.style.objectFit =
                    "contain";


                productPreview.appendChild(
                    image
                );


                addProductBtn.disabled =
                    false;


                showStatus(
                    "Background removed successfully."
                );


            } catch (error) {

                console.error(
                    "Background removal error:",
                    error
                );


                showStatus(
                    error.message ||
                    "Background removal failed."
                );


            } finally {

                removeBackgroundBtn.disabled =
                    false;

                removeBackgroundBtn.textContent =
                    "✨ Remove Background";

            }

        }
    );


    // ==========================================
    // ADD PRODUCT TO DESIGN
    // ==========================================

    addProductBtn?.addEventListener(
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

                    const maxWidth = 650;
                    const maxHeight = 620;


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
                        "Product added to your advert."
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
    // TEXT
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

        canvas.setActiveObject(
            text
        );

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

                canvas.setActiveObject(
                    price
                );

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

                canvas.setActiveObject(
                    phone
                );

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

                backgroundColor.value =
                    "#ffffff";

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

        if (!active) {
            return;
        }

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

            logoInput.click();

        }
    );


    logoInput?.addEventListener(
        "change",
        () => {

            const file =
                logoInput.files[0];

            if (!file) {
                return;
            }


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

                        fill: "#7135f2"

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
    // MOBILE TOOLS
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

                productUploadBtn?.click();

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
                    "More tools will be added here."
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


                const image =
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
                    image;


                link.click();

            }
        );


    // ==========================================
    // CANVAS CHANGES
    // ==========================================

    canvas.on(
        "object:modified",
        () => {

            saveState();

        }
    );


    // ==========================================
    // START
    // ==========================================

    canvas.renderAll();

    saveState();

});
