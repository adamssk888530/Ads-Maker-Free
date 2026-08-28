/* =====================================================
   ADS MAKER FREE
   EDITOR ENGINE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    if (typeof fabric === "undefined") {
        console.error("Fabric.js bai load ba.");
        return;
    }

    const canvas = new fabric.Canvas("designCanvas", {
        width: 1080,
        height: 1080,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        selection: true
    });

    window.adsMakerCanvas = canvas;


    /* =================================================
       ELEMENTS
    ================================================= */

    const productInput =
        document.getElementById("productImageInput");

    const productUploadBtn =
        document.getElementById("productUploadBtn");

    const uploadBtn =
        document.getElementById("uploadBtn");

    const removeBackgroundBtn =
        document.getElementById("removeBackgroundBtn");

    const addProductBtn =
        document.getElementById("addProductBtn");

    const productPreview =
        document.getElementById("productPreview");

    const backgroundColor =
        document.getElementById("backgroundColor");

    const resetBackgroundBtn =
        document.getElementById("resetBackgroundBtn");

    const addHeadlineBtn =
        document.getElementById("addHeadlineBtn");

    const addPriceBtn =
        document.getElementById("addPriceBtn");

    const addPhoneBtn =
        document.getElementById("addPhoneBtn");

    const deleteObjectBtn =
        document.getElementById("deleteObjectBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const undoBtn =
        document.getElementById("undoBtn");

    const redoBtn =
        document.getElementById("redoBtn");

    const uploadLogoBtn =
        document.getElementById("uploadLogoBtn");

    const logoInput =
        document.getElementById("logoInput");

    const templatesBtn =
        document.getElementById("templatesBtn");


    /* =================================================
       STATE
    ================================================= */

    let uploadedImage = null;

    let history = [];

    let historyPosition = -1;

    let changingHistory = false;


    /* =================================================
       CREATE TEXT
    ================================================= */

    function createText(
        text,
        left,
        top,
        size,
        color,
        weight
    ) {

        const object =
            new fabric.IText(text, {

                left: left,

                top: top,

                fill: color || "#111111",

                fontSize: size || 60,

                fontFamily: "Arial",

                fontWeight:
                    weight || "700",

                padding: 8,

                cornerColor: "#7437ff",

                cornerStyle: "circle",

                transparentCorners: false,

                borderColor: "#7437ff",

                editable: true

            });

        canvas.add(object);

        canvas.setActiveObject(object);

        canvas.renderAll();

        saveHistory();

        return object;
    }


    /* =================================================
       DEFAULT AD
    ================================================= */

    function createDefaultAd() {

        canvas.clear();

        canvas.backgroundColor = "#ffffff";


        /* Background */

        const background =
            new fabric.Rect({

                left: 0,

                top: 0,

                width: 1080,

                height: 1080,

                fill:
                    new fabric.Gradient({

                        type: "linear",

                        coords: {
                            x1: 0,
                            y1: 0,
                            x2: 1080,
                            y2: 1080
                        },

                        colorStops: [
                            {
                                offset: 0,
                                color: "#250303"
                            },
                            {
                                offset: 0.55,
                                color: "#9d0b06"
                            },
                            {
                                offset: 1,
                                color: "#170101"
                            }
                        ]
                    }),

                selectable: false,

                evented: false,

                excludeFromExport: false

            });


        canvas.add(background);


        /* Badge */

        const badge =
            new fabric.Rect({

                left: 60,

                top: 55,

                width: 155,

                height: 42,

                rx: 8,

                ry: 8,

                fill: "#ff3028"

            });

        canvas.add(badge);


        createText(
            "BIG SALE",
            80,
            65,
            20,
            "#ffffff",
            "900"
        );


        /* Headline */

        createText(
            "BIG",
            60,
            145,
            105,
            "#ffffff",
            "900"
        );


        createText(
            "SALE",
            60,
            250,
            105,
            "#ffffff",
            "900"
        );


        /* Discount */

        const discount =
            new fabric.Circle({

                left: 250,

                top: 450,

                radius: 92,

                fill: "#ffd000",

                stroke: "#ff8c00",

                strokeWidth: 5,

                originX: "center",

                originY: "center"

            });

        canvas.add(discount);


        createText(
            "50%",
            250,
            420,
            55,
            "#111111",
            "900"
        ).set({
            originX: "center"
        });


        createText(
            "OFF",
            250,
            485,
            28,
            "#111111",
            "900"
        ).set({
            originX: "center"
        });


        /* Product placeholder */

        createProductPlaceholder();


        /* Price */

        createText(
            "₦35,000",
            60,
            890,
            65,
            "#ffffff",
            "900"
        );


        const oldPrice =
            createText(
                "₦70,000",
                390,
                910,
                35,
                "#d4aaaa",
                "700"
            );

        oldPrice.set({
            opacity: 0.8
        });


        /* Button */

        const button =
            new fabric.Rect({

                left: 60,

                top: 975,

                width: 235,

                height: 70,

                rx: 35,

                ry: 35,

                fill: "#ffd000"

            });

        canvas.add(button);


        const buttonText =
            createText(
                "SHOP NOW",
                177,
                992,
                27,
                "#171000",
                "900"
            );

        buttonText.set({
            originX: "center"
        });


        /* WhatsApp */

        const whatsapp =
            new fabric.Circle({

                left: 370,

                top: 1010,

                radius: 30,

                fill: "#20c866",

                originX: "center",

                originY: "center"

            });

        canvas.add(whatsapp);


        const waText =
            createText(
                "WA",
                370,
                995,
                19,
                "#ffffff",
                "900"
            );

        waText.set({
            originX: "center"
        });


        createText(
            "080 1234 5678",
            415,
            993,
            27,
            "#ffffff",
            "700"
        );


        canvas.discardActiveObject();

        canvas.renderAll();

        history = [];

        historyPosition = -1;

        saveHistory();

    }


    /* =================================================
       PRODUCT PLACEHOLDER
    ================================================= */

    function createProductPlaceholder() {

        const shadow =
            new fabric.Ellipse({

                left: 535,

                top: 700,

                rx: 250,

                ry: 55,

                fill: "rgba(0,0,0,.35)",

                originX: "center",

                originY: "center",

                selectable: false

            });

        canvas.add(shadow);


        const shoe =
            new fabric.Group([

                new fabric.Rect({

                    width: 420,

                    height: 150,

                    rx: 65,

                    ry: 65,

                    fill: "#f4f4f4",

                    stroke: "#111111",

                    strokeWidth: 7,

                    originX: "center",

                    originY: "center"

                }),

                new fabric.Rect({

                    width: 280,

                    height: 28,

                    rx: 12,

                    ry: 12,

                    fill: "#222222",

                    top: -15,

                    originX: "center",

                    originY: "center"

                }),

                new fabric.Line(
                    [-130, -40, 40, -40],
                    {
                        stroke: "#222222",
                        strokeWidth: 10
                    }
                ),

                new fabric.Line(
                    [-120, -10, 50, -10],
                    {
                        stroke: "#222222",
                        strokeWidth: 10
                    }
                ),

                new fabric.Line(
                    [-105, 20, 60, 20],
                    {
                        stroke: "#222222",
                        strokeWidth: 10
                    }
                )

            ], {

                left: 650,

                top: 650,

                originX: "center",

                originY: "center",

                angle: -12,

                scaleX: 1.15,

                scaleY: 1.15,

                shadow:
                    new fabric.Shadow({

                        color: "rgba(0,0,0,.55)",

                        blur: 25,

                        offsetX: 0,

                        offsetY: 20

                    }),

                name: "product-placeholder"

            });


        canvas.add(shoe);

        uploadedImage = shoe;

    }


    /* =================================================
       UPLOAD IMAGE
    ================================================= */

    function openProductPicker() {

        if (productInput) {
            productInput.click();
        }

    }


    if (productUploadBtn) {

        productUploadBtn.addEventListener(
            "click",
            openProductPicker
        );

    }


    if (uploadBtn) {

        uploadBtn.addEventListener(
            "click",
            openProductPicker
        );

    }


    if (productInput) {

        productInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }


                if (!file.type.startsWith("image/")) {

                    alert(
                        "Please select an image file."
                    );

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload = function () {

                    const imageUrl =
                        reader.result;


                    uploadedImage =
                        imageUrl;


                    showProductPreview(
                        imageUrl
                    );


                    enableProductButtons();


                    addUploadedImage(
                        imageUrl
                    );

                };


                reader.readAsDataURL(file);

            }
        );

    }


    /* =================================================
       PRODUCT PREVIEW
    ================================================= */

    function showProductPreview(
        imageUrl
    ) {

        if (!productPreview) {
            return;
        }


        productPreview.innerHTML = "";


        const image =
            document.createElement("img");


        image.src = imageUrl;


        image.style.width =
            "100%";


        image.style.height =
            "120px";


        image.style.objectFit =
            "contain";


        image.style.borderRadius =
            "10px";


        productPreview.appendChild(
            image
        );

    }


    /* =================================================
       ENABLE PRODUCT BUTTONS
    ================================================= */

    function enableProductButtons() {

        if (removeBackgroundBtn) {

            removeBackgroundBtn.disabled =
                false;

        }


        if (addProductBtn) {

            addProductBtn.disabled =
                false;

        }

    }


    /* =================================================
       ADD UPLOADED IMAGE
    ================================================= */

    function addUploadedImage(
        imageUrl
    ) {

        fabric.Image.fromURL(
            imageUrl
        ).then(function (image) {

            const scale =
                Math.min(
                    500 / image.width,
                    500 / image.height
                );


            image.set({

                left: 650,

                top: 650,

                originX: "center",

                originY: "center",

                scaleX: scale,

                scaleY: scale,

                cornerColor: "#7437ff",

                borderColor: "#7437ff",

                transparentCorners: false,

                name: "uploaded-product"

            });


            /* Remove old placeholder */

            const objects =
                canvas.getObjects();


            objects.forEach(
                function (object) {

                    if (
                        object.name ===
                        "product-placeholder"
                    ) {

                        canvas.remove(
                            object
                        );

                    }

                }
            );


            canvas.add(image);

            canvas.setActiveObject(image);

            canvas.renderAll();

            saveHistory();

        });

    }


    /* =================================================
       REMOVE BACKGROUND
    ================================================= */

    if (removeBackgroundBtn) {

        removeBackgroundBtn.addEventListener(
            "click",
            function () {

                if (!uploadedImage) {

                    alert(
                        "Please upload a product image first."
                    );

                    return;

                }


                alert(
                    "AI Background Removal zai haɗu da Python API a mataki na gaba."
                );

            }
        );

    }


    /* =================================================
       ADD PRODUCT TO DESIGN
    ================================================= */

    if (addProductBtn) {

        addProductBtn.addEventListener(
            "click",
            function () {

                if (!uploadedImage) {

                    alert(
                        "Please upload a product image first."
                    );

                    return;

                }


                const active =
                    canvas.getActiveObject();


                if (active) {

                    active.set({
                        visible: true
                    });

                    canvas.renderAll();

                }

            }
        );

    }


    /* =================================================
       HEADLINE
    ================================================= */

    if (addHeadlineBtn) {

        addHeadlineBtn.addEventListener(
            "click",
            function () {

                createText(
                    "YOUR HEADLINE",
                    100,
                    150,
                    65,
                    "#111111",
                    "900"
                );

            }
        );

    }


    /* =================================================
       PRICE
    ================================================= */

    if (addPriceBtn) {

        addPriceBtn.addEventListener(
            "click",
            function () {

                createText(
                    "₦35,000",
                    100,
                    800,
                    60,
                    "#111111",
                    "900"
                );

            }
        );

    }


    /* =================================================
       WHATSAPP
    ================================================= */

    if (addPhoneBtn) {

        addPhoneBtn.addEventListener(
            "click",
            function () {

                createText(
                    "080 1234 5678",
                    100,
                    900,
                    35,
                    "#111111",
                    "700"
                );

            }
        );

    }


    /* =================================================
       BACKGROUND COLOR
    ================================================= */

    if (backgroundColor) {

        backgroundColor.addEventListener(
            "input",
            function () {

                canvas.backgroundColor =
                    backgroundColor.value;

                canvas.renderAll();

            }
        );


        backgroundColor.addEventListener(
            "change",
            saveHistory
        );

    }


    /* =================================================
       RESET BACKGROUND
    ================================================= */

    if (resetBackgroundBtn) {

        resetBackgroundBtn.addEventListener(
            "click",
            function () {

                canvas.backgroundColor =
                    "#ffffff";

                canvas.renderAll();

                saveHistory();

            }
        );

    }


    /* =================================================
       DELETE OBJECT
    ================================================= */

    if (deleteObjectBtn) {

        deleteObjectBtn.addEventListener(
            "click",
            function () {

                const object =
                    canvas.getActiveObject();


                if (!object) {

                    alert(
                        "Select an object first."
                    );

                    return;

                }


                canvas.remove(object);

                canvas.discardActiveObject();

                canvas.renderAll();

                saveHistory();

            }
        );

    }


    /* =================================================
       KEYBOARD DELETE
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            const object =
                canvas.getActiveObject();


            if (!object) {
                return;
            }


            if (
                event.key === "Delete" ||
                event.key === "Backspace"
            ) {

                if (object.isEditing) {
                    return;
                }


                canvas.remove(object);

                canvas.discardActiveObject();

                canvas.renderAll();

                saveHistory();

            }

        }
    );


    /* =================================================
       UNDO
    ================================================= */

    if (undoBtn) {

        undoBtn.addEventListener(
            "click",
            function () {

                if (
                    historyPosition <= 0
                ) {
                    return;
                }


                historyPosition--;


                restoreHistory(
                    history[
                        historyPosition
                    ]
                );

            }
        );

    }


    /* =================================================
       REDO
    ================================================= */

    if (redoBtn) {

        redoBtn.addEventListener(
            "click",
            function () {

                if (
                    historyPosition >=
                    history.length - 1
                ) {
                    return;
                }


                historyPosition++;


                restoreHistory(
                    history[
                        historyPosition
                    ]
                );

            }
        );

    }


    /* =================================================
       HISTORY
    ================================================= */

    function saveHistory() {

        if (changingHistory) {
            return;
        }


        const json =
            JSON.stringify(
                canvas.toJSON()
            );


        if (
            history[
                historyPosition
            ] === json
        ) {

            return;

        }


        history =
            history.slice(
                0,
                historyPosition + 1
            );


        history.push(json);


        historyPosition =
            history.length - 1;


        if (history.length > 30) {

            history.shift();

            historyPosition--;

        }

    }


    function restoreHistory(
        json
    ) {

        changingHistory = true;


        canvas.loadFromJSON(
            JSON.parse(json)
        ).then(function () {

            canvas.renderAll();

            changingHistory = false;

        });

    }


    canvas.on(
        "object:modified",
        saveHistory
    );


    canvas.on(
        "object:removed",
        saveHistory
    );


    /* =================================================
       LOGO
    ================================================= */

    if (uploadLogoBtn) {

        uploadLogoBtn.addEventListener(
            "click",
            function () {

                if (logoInput) {
                    logoInput.click();
                }

            }
        );

    }


    if (logoInput) {

        logoInput.addEventListener(
            "change",
            function (event) {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }


                const reader =
                    new FileReader();


                reader.onload =
                    function () {

                        fabric.Image
                            .fromURL(
                                reader.result
                            )
                            .then(
                                function (image) {

                                    const scale =
                                        Math.min(
                                            160 / image.width,
                                            160 / image.height
                                        );


                                    image.set({

                                        left: 930,

                                        top: 70,

                                        scaleX:
                                            scale,

                                        scaleY:
                                            scale,

                                        originX:
                                            "center",

                                        originY:
                                            "center",

                                        name:
                                            "logo"

                                    });


                                    canvas.add(
                                        image
                                    );

                                    canvas.setActiveObject(
                                        image
                                    );

                                    canvas.renderAll();

                                    saveHistory();

                                }
                            );

                    };


                reader.readAsDataURL(file);

            }
        );

    }


    /* =================================================
       TEMPLATES
    ================================================= */

    if (templatesBtn) {

        templatesBtn.addEventListener(
            "click",
            function () {

                window.location.href =
                    "templates.html";

            }
        );

    }


    /* =================================================
       DOWNLOAD
    ================================================= */

    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            function () {

                canvas.discardActiveObject();

                canvas.renderAll();


                const image =
                    canvas.toDataURL({
                        format: "png",
                        multiplier: 1
                    });


                const link =
                    document.createElement("a");


                link.href =
                    image;


                link.download =
                    "ads-maker-free.png";


                document.body.appendChild(
                    link
                );


                link.click();

                link.remove();

            }
        );

    }


    /* =================================================
       MOBILE BUTTONS
    ================================================= */

    const mobileTemplatesBtn =
        document.getElementById(
            "mobileTemplatesBtn"
        );

    const mobileUploadBtn =
        document.getElementById(
            "mobileUploadBtn"
        );

    const mobileTextBtn =
        document.getElementById(
            "mobileTextBtn"
        );


    if (mobileTemplatesBtn) {

        mobileTemplatesBtn.onclick =
            function () {

                window.location.href =
                    "templates.html";

            };

    }


    if (mobileUploadBtn) {

        mobileUploadBtn.onclick =
            openProductPicker;

    }


    if (mobileTextBtn) {

        mobileTextBtn.onclick =
            function () {

                addHeadlineBtn?.click();

            };

    }


    /* =================================================
       START
    ================================================= */

    createDefaultAd();

});
