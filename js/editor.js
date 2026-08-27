// ==========================================
// ADS MAKER FREE
// EDITOR ENGINE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    // ------------------------------------------
    // CANVAS
    // ------------------------------------------

    const canvas = new fabric.Canvas("designCanvas", {
        width: 1080,
        height: 1080,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true
    });


    // ------------------------------------------
    // VARIABLES
    // ------------------------------------------

    let uploadedProduct = null;
    let productDataUrl = null;

    let history = [];
    let historyIndex = -1;
    let restoring = false;


    // ------------------------------------------
    // HELPERS
    // ------------------------------------------

    function saveState() {

        if (restoring) return;

        const state = JSON.stringify(
            canvas.toJSON()
        );

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


    function showStatus(message) {

        let box =
            document.querySelector(
                ".editor-status"
            );

        if (!box) {

            box =
                document.createElement("div");

            box.className =
                "editor-status";

            box.style.position = "fixed";
            box.style.left = "50%";
            box.style.bottom = "80px";
            box.style.transform =
                "translateX(-50%)";

            box.style.background =
                "#171827";

            box.style.color =
                "#ffffff";

            box.style.padding =
                "10px 16px";

            box.style.borderRadius =
                "9px";

            box.style.fontSize =
                "12px";

            box.style.fontWeight =
                "700";

            box.style.zIndex =
                "99999";

            box.style.boxShadow =
                "0 8px 25px rgba(0,0,0,.2)";

            document.body.appendChild(box);
        }

        box.textContent = message;

        clearTimeout(box.timer);

        box.timer =
            setTimeout(() => {

                box.remove();

            }, 2500);
    }


    // ------------------------------------------
    // UNDO
    // ------------------------------------------

    document
        .getElementById("undoBtn")
        ?.addEventListener(
            "click",
            () => {

                if (historyIndex <= 0) {
                    return;
                }

                historyIndex--;

                restoreState(
                    history[historyIndex]
                );

            }
        );


    // ------------------------------------------
    // REDO
    // ------------------------------------------

    document
        .getElementById("redoBtn")
        ?.addEventListener(
            "click",
            () => {

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

            }
        );


    // ------------------------------------------
    // OLD UPLOAD BUTTON
    // ------------------------------------------

    const uploadBtn =
        document.getElementById(
            "uploadBtn"
        );


    const oldInput =
        document.createElement("input");

    oldInput.type = "file";

    oldInput.accept =
        "image/png,image/jpeg,image/webp";

    oldInput.hidden = true;

    document.body.appendChild(
        oldInput
    );


    uploadBtn?.addEventListener(
        "click",
        () => {

            oldInput.click();

        }
    );


    oldInput.addEventListener(
        "change",
        () => {

            const file =
                oldInput.files[0];

            if (!file) return;

            readImage(
                file,
                true
            );

            oldInput.value = "";

        }
    );


    // ------------------------------------------
    // PRODUCT UPLOAD
    // ------------------------------------------

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

            if (!file) return;

            if (
                !file.type.startsWith(
                    "image/"
                )
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


                    uploadedProduct =
                        file;


                    // Preview
                    productPreview.innerHTML = "";

                    const img =
                        document.createElement(
                            "img"
                        );

                    img.src =
                        productDataUrl;

                    img.style.width =
                        "100%";

                    img.style.height =
                        "130px";

                    img.style.objectFit =
                        "contain";

                    productPreview.appendChild(
                        img
                    );


                    removeBackgroundBtn.disabled =
                        false;

                    addProductBtn.disabled =
                        false;


                    showStatus(
                        "Product image loaded."
                    );

                };


            reader.readAsDataURL(file);

            productImageInput.value = "";

        }
    );


    // ------------------------------------------
    // REMOVE BACKGROUND
    // ------------------------------------------

    removeBackgroundBtn?.addEventListener(
        "click",
        () => {

            if (!productDataUrl) {

                showStatus(
                    "Upload a product image first."
                );

                return;
            }


            /*
             * IMPORTANT:
             *
             * This is intentionally NOT
             * pretending to remove the background.
             *
             * Real background removal will be
             * connected to an image-processing API
             * in the next stage.
             */

            showStatus(
                "Real background removal will be connected next."
            );

        }
    );


    // ------------------------------------------
    // ADD PRODUCT TO CANVAS
    // ------------------------------------------

    addProductBtn?.addEventListener(
        "click",
        () => {

            if (!productDataUrl) {

                showStatus(
                    "Upload a product image first."
                );

                return;
            }


            addImageToCanvas(
                productDataUrl
            );

        }
    );


    // ------------------------------------------
    // ADD IMAGE
    // ------------------------------------------

    function addImageToCanvas(
        dataUrl
    ) {

        fabric.Image.fromURL(
            dataUrl,
            (img) => {

                const maxSize = 650;

                let scale =
                    Math.min(
                        maxSize / img.width,
                        maxSize / img.height
                    );


                if (scale > 1) {
                    scale = 1;
                }


                img.set({

                    left:
                        (
                            canvas.width -
                            img.width * scale
                        ) / 2,

                    top:
                        230,

                    scaleX:
                        scale,

                    scaleY:
                        scale,

                    cornerColor:
                        "#7135f2",

                    cornerStrokeColor:
                        "#7135f2",

                    borderColor:
                        "#7135f2",

                    transparentCorners:
                        false

                });


                canvas.add(img);

                canvas.setActiveObject(
                    img
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


    // ------------------------------------------
    // TEXT
    // ------------------------------------------

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


    // ------------------------------------------
    // PRICE
    // ------------------------------------------

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


    // ------------------------------------------
    // WHATSAPP
    // ------------------------------------------

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


    // ------------------------------------------
    // BACKGROUND COLOR
    // ------------------------------------------

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


    // ------------------------------------------
    // RESET BACKGROUND
    // ------------------------------------------

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


    // ------------------------------------------
    // DELETE OBJECT
    // ------------------------------------------

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

            const active =
                canvas.getActiveObject();

            if (!active) return;


            if (
                event.key ===
                "Delete"
            ) {

                deleteSelected();

            }

        }
    );


    function deleteSelected() {

        const active =
            canvas.getActiveObject();

        if (!active) return;

        canvas.remove(active);

        canvas.discardActiveObject();

        canvas.renderAll();

        saveState();

    }


    // ------------------------------------------
    // LOGO
    // ------------------------------------------

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


    // ------------------------------------------
    // TEMPLATE BUTTON
    // ------------------------------------------

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


    // ------------------------------------------
    // ELEMENTS BUTTON
    // ------------------------------------------

    document
        .getElementById(
            "elementsBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                const circle =
                    new fabric.Circle({

                        left: 400,

                        top: 400,

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


    // ------------------------------------------
    // MOBILE BUTTONS
    // ------------------------------------------

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
                    "More editing tools coming next."
                );

            }
        );


    // ------------------------------------------
    // DOWNLOAD
    // ------------------------------------------

    document
        .getElementById(
            "downloadBtn"
        )
        ?.addEventListener(
            "click",
            () => {

                canvas.discardActiveObject();

                canvas.renderAll();


                const dataURL =
                    canvas.toDataURL({

                        format:
                            "png",

                        multiplier:
                            1,

                        quality:
                            1

                    });


                const link =
                    document.createElement(
                        "a"
                    );

                link.download =
                    "ads-maker-free.png";

                link.href =
                    dataURL;

                link.click();

            }
        );


    // ------------------------------------------
    // CANVAS CHANGES
    // ------------------------------------------

    canvas.on(
        "object:modified",
        saveState
    );


    canvas.on(
        "object:added",
        () => {

            if (!restoring) {
                canvas.renderAll();
            }

        }
    );


    // ------------------------------------------
    // READ IMAGE
    // ------------------------------------------

    function readImage(
        file,
        addImmediately
    ) {

        const reader =
            new FileReader();


        reader.onload =
            (event) => {

                if (addImmediately) {

                    addImageToCanvas(
                        event.target.result
                    );

                }

            };


        reader.readAsDataURL(file);

    }


    // ------------------------------------------
    // INITIAL STATE
    // ------------------------------------------

    canvas.renderAll();

    saveState();

});
