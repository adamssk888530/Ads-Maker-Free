/* =========================================================
   ADS MAKER FREE
   PROFESSIONAL EDITOR
   Fabric.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CHECK FABRIC
    ===================================================== */

    if (typeof fabric === "undefined") {
        console.error("Fabric.js was not loaded.");
        alert("Editor failed to load. Please refresh the page.");
        return;
    }


    /* =====================================================
       CANVAS
    ===================================================== */

    const canvasElement =
        document.getElementById("designCanvas");

    if (!canvasElement) {
        console.error("designCanvas not found.");
        return;
    }


    const canvas = new fabric.Canvas(
        "designCanvas",
        {
            width: 1080,
            height: 1350,

            backgroundColor: "#ffffff",

            preserveObjectStacking: true,

            selection: true
        }
    );


    window.adsMakerCanvas = canvas;


    /* =====================================================
       VARIABLES
    ===================================================== */

    let history = [];

    let historyIndex = -1;

    let isRestoring = false;

    let selectedProduct = null;

    let selectedTemplate =
        new URLSearchParams(
            window.location.search
        ).get("template") || "sale";


    /* =====================================================
       HELPERS
    ===================================================== */

    function addObject(object) {

        canvas.add(object);

        canvas.setActiveObject(object);

        canvas.renderAll();

        saveHistory();

    }


    function makeText(
        text,
        options = {}
    ) {

        return new fabric.IText(
            text,
            {
                left: options.left || 100,

                top: options.top || 100,

                fill:
                    options.fill ||
                    "#ffffff",

                fontSize:
                    options.fontSize ||
                    60,

                fontFamily:
                    options.fontFamily ||
                    "Arial",

                fontWeight:
                    options.fontWeight ||
                    "700",

                originX:
                    options.originX ||
                    "left",

                originY:
                    options.originY ||
                    "top",

                selectable: true,

                editable: true,

                shadow:
                    options.shadow ||
                    null
            }
        );

    }


    function makeRect(
        options = {}
    ) {

        return new fabric.Rect({

            left:
                options.left || 0,

            top:
                options.top || 0,

            width:
                options.width || 100,

            height:
                options.height || 100,

            fill:
                options.fill ||
                "#ffffff",

            rx:
                options.rx || 0,

            ry:
                options.ry || 0,

            selectable:
                options.selectable !== false
        });

    }


    function addGlowCircle(
        left,
        top,
        radius,
        color
    ) {

        const circle =
            new fabric.Circle({

                left,

                top,

                radius,

                originX: "center",

                originY: "center",

                fill: color,

                opacity: 0.75,

                shadow:
                    new fabric.Shadow({
                        color: color,
                        blur: 80,
                        offsetX: 0,
                        offsetY: 0
                    }),

                selectable: false,

                evented: false
            });

        canvas.add(circle);

    }


    /* =====================================================
       GRADIENT BACKGROUND
    ===================================================== */

    function setBackground(
        color1,
        color2,
        color3
    ) {

        const gradient =
            new fabric.Gradient({

                type: "linear",

                coords: {
                    x1: 0,
                    y1: 0,
                    x2: 1080,
                    y2: 1350
                },

                colorStops: [

                    {
                        offset: 0,
                        color: color1
                    },

                    {
                        offset: 0.52,
                        color: color2
                    },

                    {
                        offset: 1,
                        color: color3
                    }

                ]

            });

        canvas.backgroundColor =
            gradient;

        canvas.renderAll();

    }


    /* =====================================================
       DECORATIVE LIGHT
    ===================================================== */

    function addBackgroundLights(
        color
    ) {

        addGlowCircle(
            760,
            610,
            190,
            color
        );

        addGlowCircle(
            250,
            1040,
            150,
            color
        );

    }


    /* =====================================================
       SALE TEMPLATE
    ===================================================== */

    function loadSaleTemplate() {

        canvas.clear();

        canvas.setWidth(1080);

        canvas.setHeight(1350);


        setBackground(
            "#210202",
            "#8d0805",
            "#100101"
        );


        addBackgroundLights(
            "#ff2518"
        );


        /* ---------------------------------------------
           TOP BADGE
        --------------------------------------------- */

        const badge =
            makeRect({

                left: 70,
                top: 65,

                width: 150,
                height: 42,

                fill: "#f52a24",

                rx: 8,
                ry: 8

            });

        badge.set({
            selectable: false,
            evented: false
        });

        canvas.add(badge);


        const badgeText =
            makeText(
                "BIG SALE",
                {
                    left: 88,
                    top: 73,

                    fontSize: 19,

                    fontWeight: "900"
                }
            );

        badgeText.set({
            selectable: false,
            evented: false
        });

        canvas.add(badgeText);


        /* ---------------------------------------------
           MAIN HEADLINE
        --------------------------------------------- */

        canvas.add(
            makeText(
                "BIG",
                {
                    left: 70,
                    top: 145,

                    fontSize: 112,

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "SALE",
                {
                    left: 70,
                    top: 255,

                    fontSize: 112,

                    fontWeight: "900"
                }
            )
        );


        /* ---------------------------------------------
           DISCOUNT CIRCLE
        --------------------------------------------- */

        const discount =
            new fabric.Circle({

                left: 260,
                top: 475,

                radius: 95,

                originX: "center",
                originY: "center",

                fill: "#ffd000",

                stroke: "#ff8a00",

                strokeWidth: 6,

                shadow:
                    new fabric.Shadow({
                        color: "#ff9d00",
                        blur: 30,
                        offsetX: 0,
                        offsetY: 0
                    })
            });

        canvas.add(discount);


        canvas.add(
            makeText(
                "UP TO",
                {
                    left: 260,
                    top: 420,

                    originX: "center",

                    fontSize: 28,

                    fill: "#111111",

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "50%",
                {
                    left: 260,
                    top: 452,

                    originX: "center",

                    fontSize: 62,

                    fill: "#111111",

                    fontWeight: "950"
                }
            )
        );


        canvas.add(
            makeText(
                "OFF",
                {
                    left: 260,
                    top: 515,

                    originX: "center",

                    fontSize: 30,

                    fill: "#111111",

                    fontWeight: "900"
                }
            )
        );


        /* ---------------------------------------------
           PRODUCT PLACEHOLDER
        --------------------------------------------- */

        createShoeGraphic();


        /* ---------------------------------------------
           PRICE
        --------------------------------------------- */

        canvas.add(
            makeText(
                "₦35,000",
                {
                    left: 70,
                    top: 1070,

                    fontSize: 68,

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "₦70,000",
                {
                    left: 420,
                    top: 1090,

                    fontSize: 38,

                    fontWeight: "700",

                    fill: "#bdb7b7",

                    shadow: null
                }
            )
        );


        /* ---------------------------------------------
           SHOP BUTTON
        --------------------------------------------- */

        const shopButton =
            makeRect({

                left: 70,
                top: 1190,

                width: 245,
                height: 78,

                fill: "#ffd000",

                rx: 38,
                ry: 38
            });

        canvas.add(shopButton);


        canvas.add(
            makeText(
                "SHOP NOW",
                {
                    left: 193,
                    top: 1210,

                    originX: "center",

                    fontSize: 31,

                    fill: "#151000",

                    fontWeight: "900"
                }
            )
        );


        /* ---------------------------------------------
           WHATSAPP
        --------------------------------------------- */

        const whatsapp =
            new fabric.Circle({

                left: 385,
                top: 1228,

                radius: 29,

                fill: "#18c65a",

                originX: "center",
                originY: "center"
            });

        canvas.add(whatsapp);


        canvas.add(
            makeText(
                "WA",
                {
                    left: 385,
                    top: 1213,

                    originX: "center",

                    fontSize: 20,

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "080 1234 5678",
                {
                    left: 430,
                    top: 1208,

                    fontSize: 31,

                    fontWeight: "700"
                }
            )
        );


        canvas.renderAll();

        saveHistory();

    }


    /* =====================================================
       OTHER TEMPLATES
    ===================================================== */

    function loadNewTemplate() {

        canvas.clear();

        setBackground(
            "#020a1c",
            "#0b3e8a",
            "#02050d"
        );

        addBackgroundLights("#2181ff");


        canvas.add(
            makeText(
                "NEW",
                {
                    left: 70,
                    top: 80,

                    fontSize: 90,

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "COLLECTION",
                {
                    left: 70,
                    top: 175,

                    fontSize: 72,

                    fontWeight: "900"
                }
            )
        );


        createShoeGraphic();


        canvas.add(
            makeText(
                "₦42,000",
                {
                    left: 70,
                    top: 1090,

                    fontSize: 70,

                    fontWeight: "900"
                }
            )
        );


        addShopButton(
            "#147cff"
        );


        canvas.renderAll();

        saveHistory();

    }


    function loadPremiumTemplate() {

        canvas.clear();

        setBackground(
            "#070707",
            "#33270a",
            "#050505"
        );

        addBackgroundLights(
            "#d5a719"
        );


        canvas.add(
            makeText(
                "PREMIUM",
                {
                    left: 70,
                    top: 85,

                    fontSize: 40,

                    fill: "#ffd21a",

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "SNEAKERS",
                {
                    left: 70,
                    top: 140,

                    fontSize: 83,

                    fontWeight: "900"
                }
            )
        );


        createShoeGraphic();


        canvas.add(
            makeText(
                "₦38,000",
                {
                    left: 70,
                    top: 1080,

                    fontSize: 70,

                    fill: "#ffd21a",

                    fontWeight: "900"
                }
            )
        );


        addShopButton(
            "#ffd21a",
            "#151000"
        );


        canvas.renderAll();

        saveHistory();

    }


    function loadCasualTemplate() {

        canvas.clear();

        setBackground(
            "#f3f1ea",
            "#ddd8cd",
            "#c8c4bb"
        );


        canvas.add(
            makeText(
                "CASUAL",
                {
                    left: 70,
                    top: 100,

                    fontSize: 90,

                    fill: "#161616",

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "SHOES",
                {
                    left: 70,
                    top: 195,

                    fontSize: 90,

                    fill: "#161616",

                    fontWeight: "900"
                }
            )
        );


        createShoeGraphic(
            "#d5c7b4"
        );


        canvas.add(
            makeText(
                "₦28,000",
                {
                    left: 70,
                    top: 1080,

                    fontSize: 70,

                    fill: "#198d42",

                    fontWeight: "900"
                }
            )
        );


        addShopButton(
            "#25a84b"
        );


        canvas.renderAll();

        saveHistory();

    }


    function loadSneakersTemplate() {

        canvas.clear();

        setBackground(
            "#090018",
            "#4c147d",
            "#08000f"
        );

        addBackgroundLights(
            "#b928ff"
        );


        canvas.add(
            makeText(
                "SNEAKERS",
                {
                    left: 70,
                    top: 100,

                    fontSize: 82,

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "FOR YOU",
                {
                    left: 70,
                    top: 190,

                    fontSize: 70,

                    fontWeight: "900"
                }
            )
        );


        createShoeGraphic(
            "#7040d9"
        );


        canvas.add(
            makeText(
                "₦33,000",
                {
                    left: 70,
                    top: 1080,

                    fontSize: 70,

                    fontWeight: "900"
                }
            )
        );


        addShopButton(
            "#ed2994"
        );


        canvas.renderAll();

        saveHistory();

    }


    function loadPerformanceTemplate() {

        canvas.clear();

        setBackground(
            "#020b01",
            "#174c0b",
            "#010501"
        );

        addBackgroundLights(
            "#25a928"
        );


        canvas.add(
            makeText(
                "PERFORMANCE",
                {
                    left: 70,
                    top: 100,

                    fontSize: 65,

                    fontWeight: "900"
                }
            )
        );


        canvas.add(
            makeText(
                "UNLEASHED",
                {
                    left: 70,
                    top: 175,

                    fontSize: 72,

                    fontWeight: "900"
                }
            )
        );


        createShoeGraphic(
            "#25a928"
        );


        canvas.add(
            makeText(
                "₦45,000",
                {
                    left: 70,
                    top: 1080,

                    fontSize: 70,

                    fontWeight: "900"
                }
            )
        );


        addShopButton(
            "#2cae45"
        );


        canvas.renderAll();

        saveHistory();

    }


    /* =====================================================
       SHOE GRAPHIC
    ===================================================== */

    function createShoeGraphic(
        accent = "#ffffff"
    ) {

        const group =
            new fabric.Group(
                [

                    new fabric.Ellipse({

                        rx: 250,
                        ry: 80,

                        fill: "rgba(0,0,0,.35)",

                        originX: "center",
                        originY: "center"
                    }),

                    new fabric.Rect({

                        width: 430,
                        height: 170,

                        rx: 75,
                        ry: 75,

                        fill: accent,

                        stroke: "#111111",

                        strokeWidth: 9,

                        originX: "center",
                        originY: "center"
                    }),

                    new fabric.Rect({

                        width: 360,
                        height: 35,

                        rx: 15,
                        ry: 15,

                        fill: "#111111",

                        top: 45,

                        originX: "center",
                        originY: "center"
                    }),

                    new fabric.Triangle({

                        width: 140,
                        height: 150,

                        fill: accent,

                        angle: 90,

                        left: 195,

                        originX: "center",
                        originY: "center"
                    }),

                    new fabric.Line(
                        [-130, -40, 40, -40],
                        {
                            stroke: "#111111",
                            strokeWidth: 12
                        }
                    ),

                    new fabric.Line(
                        [-115, -10, 55, -10],
                        {
                            stroke: "#111111",
                            strokeWidth: 12
                        }
                    ),

                    new fabric.Line(
                        [-95, 20, 75, 20],
                        {
                            stroke: "#111111",
                            strokeWidth: 12
                        }
                    )

                ],
                {
                    left: 575,
                    top: 700,

                    originX: "center",
                    originY: "center",

                    angle: -12,

                    scaleX: 1.25,
                    scaleY: 1.25,

                    shadow:
                        new fabric.Shadow({
                            color: "rgba(0,0,0,.65)",
                            blur: 25,
                            offsetX: 0,
                            offsetY: 20
                        })
                }
            );


        group.set({
            name: "product"
        });


        canvas.add(group);

        canvas.setActiveObject(group);

        selectedProduct = group;

    }


    /* =====================================================
       SHOP BUTTON
    ===================================================== */

    function addShopButton(
        background = "#ffd000",
        textColor = "#111111"
    ) {

        const button =
            makeRect({

                left: 70,
                top: 1190,

                width: 245,
                height: 78,

                fill: background,

                rx: 38,
                ry: 38
            });

        canvas.add(button);


        canvas.add(
            makeText(
                "SHOP NOW",
                {
                    left: 193,
                    top: 1210,

                    originX: "center",

                    fontSize: 30,

                    fill: textColor,

                    fontWeight: "900"
                }
            )
        );

    }


    /* =====================================================
       LOAD SELECTED TEMPLATE
    ===================================================== */

    function loadTemplate(
        template
    ) {

        selectedTemplate =
            template || "sale";


        switch (selectedTemplate) {

            case "new":
                loadNewTemplate();
                break;

            case "premium":
                loadPremiumTemplate();
                break;

            case "casual":
                loadCasualTemplate();
                break;

            case "sneakers":
                loadSneakersTemplate();
                break;

            case "performance":
                loadPerformanceTemplate();
                break;

            case "sale":

            default:
                loadSaleTemplate();
                break;

        }

    }


    /* =====================================================
       HISTORY
    ===================================================== */

    function getCanvasState() {

        return JSON.stringify(
            canvas.toJSON([
                "name"
            ])
        );

    }


    function saveHistory() {

        if (isRestoring) {
            return;
        }


        const state =
            getCanvasState();


        if (
            historyIndex >= 0 &&
            history[historyIndex] === state
        ) {
            return;
        }


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


    function restoreState(
        state
    ) {

        isRestoring = true;


        canvas.loadFromJSON(
            JSON.parse(state)
        ).then(() => {

            canvas.renderAll();

            isRestoring = false;

        });

    }


    function undo() {

        if (historyIndex <= 0) {
            return;
        }


        historyIndex--;

        restoreState(
            history[historyIndex]
        );

    }


    function redo() {

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


    /* =====================================================
       CANVAS CHANGE EVENTS
    ===================================================== */

    canvas.on(
        "object:modified",
        saveHistory
    );

    canvas.on(
        "object:added",
        () => {

            if (!isRestoring) {
                saveHistory();
            }

        }
    );

    canvas.on(
        "object:removed",
        saveHistory
    );


    /* =====================================================
       UPLOAD PRODUCT
    ===================================================== */

    const productUploadButton =
        document.getElementById(
            "productUploadBtn"
        );

    const productInput =
        document.getElementById(
            "productImageInput"
        );


    if (productUploadButton) {

        productUploadButton.addEventListener(
            "click",
            () => {

                productInput?.click();

            }
        );

    }


    if (productInput) {

        productInput.addEventListener(
            "change",
            (event) => {

                const file =
                    event.target.files?.[0];

                if (!file) {
                    return;
                }


                const reader =
                    new FileReader();


                reader.onload = () => {

                    fabric.FabricImage
                        .fromURL(
                            reader.result
                        )
                        .then((image) => {

                            image.set({

                                left: 540,

                                top: 680,

                                originX:
                                    "center",

                                originY:
                                    "center",

                                scaleX:
                                    0.5,

                                scaleY:
                                    0.5,

                                name:
                                    "uploaded-product"

                            });


                            if (
                                selectedProduct
                            ) {

                                canvas.remove(
                                    selectedProduct
                                );

                            }


                            canvas.add(image);

                            canvas.setActiveObject(
                                image
                            );


                            selectedProduct =
                                image;


                            canvas.renderAll();

                            saveHistory();

                            updateProductPreview(
                                reader.result
                            );

                        });

                };


                reader.readAsDataURL(file);

            }
        );

    }


    /* =====================================================
       PRODUCT PREVIEW
    ===================================================== */

    function updateProductPreview(
        src
    ) {

        const preview =
            document.getElementById(
                "productPreview"
            );

        if (!preview) {
            return;
        }


        preview.innerHTML = "";


        const image =
            document.createElement("img");

        image.src = src;

        image.style.width = "100%";

        image.style.height = "120px";

        image.style.objectFit = "contain";

        image.style.borderRadius = "10px";


        preview.appendChild(image);

    }


    /* =====================================================
       REMOVE BACKGROUND
    ===================================================== */

    const removeBackgroundButton =
        document.getElementById(
            "removeBackgroundBtn"
        );


    if (removeBackgroundButton) {

        removeBackgroundButton.addEventListener(
            "click",
            () => {

                if (!selectedProduct) {

                    alert(
                        "Please upload a product image first."
                    );

                    return;

                }


                /*
                 * Real AI background removal
                 * will be connected here.
                 *
                 * We intentionally do NOT put
                 * an API key inside this browser
                 * code.
                 */


                alert(
                    "Product selected. AI background removal will be connected through the secure server API."
                );

            }
        );

    }


    /* =====================================================
       ADD PRODUCT
    ===================================================== */

    const addProductButton =
        document.getElementById(
            "addProductBtn"
        );


    if (addProductButton) {

        addProductButton.addEventListener(
            "click",
            () => {

                if (!selectedProduct) {

                    alert(
                        "Upload a product image first."
                    );

                    return;

                }


                selectedProduct.set({
                    visible: true
                });


                canvas.setActiveObject(
                    selectedProduct
                );

                canvas.renderAll();

                saveHistory();

            }
        );

    }


    /* =====================================================
       ADD HEADLINE
    ===================================================== */

    const headlineButton =
        document.getElementById(
            "addHeadlineBtn"
        );


    if (headlineButton) {

        headlineButton.addEventListener(
            "click",
            () => {

                const text =
                    makeText(
                        "NEW HEADLINE",
                        {
                            left: 100,
                            top: 100,

                            fontSize: 65,

                            fontWeight: "900"
                        }
                    );


                addObject(text);

            }
        );

    }


    /* =====================================================
       ADD PRICE
    ===================================================== */

    const priceButton =
        document.getElementById(
            "addPriceBtn"
        );


    if (priceButton) {

        priceButton.addEventListener(
            "click",
            () => {

                const text =
                    makeText(
                        "₦35,000",
                        {
                            left: 100,
                            top: 900,

                            fontSize: 65,

                            fontWeight: "900"
                        }
                    );


                addObject(text);

            }
        );

    }


    /* =====================================================
       ADD WHATSAPP
    ===================================================== */

    const phoneButton =
        document.getElementById(
            "addPhoneBtn"
        );


    if (phoneButton) {

        phoneButton.addEventListener(
            "click",
            () => {

                const text =
                    makeText(
                        "080 1234 5678",
                        {
                            left: 400,
                            top: 1200,

                            fontSize: 30,

                            fontWeight: "700"
                        }
                    );


                addObject(text);

            }
        );

    }


    /* =====================================================
       BACKGROUND COLOR
    ===================================================== */

    const backgroundColor =
        document.getElementById(
            "backgroundColor"
        );


    if (backgroundColor) {

        backgroundColor.addEventListener(
            "input",
            () => {

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


    /* =====================================================
       RESET BACKGROUND
    ===================================================== */

    const resetBackgroundButton =
        document.getElementById(
            "resetBackgroundBtn"
        );


    if (resetBackgroundButton) {

        resetBackgroundButton.addEventListener(
            "click",
            () => {

                canvas.backgroundColor =
                    "#ffffff";

                canvas.renderAll();

                saveHistory();

            }
        );

    }


    /* =====================================================
       DELETE OBJECT
    ===================================================== */

    const deleteButton =
        document.getElementById(
            "deleteObjectBtn"
        );


    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            () => {

                const activeObject =
                    canvas.getActiveObject();


                if (!activeObject) {

                    alert(
                        "Select an object first."
                    );

                    return;

                }


                canvas.remove(
                    activeObject
                );

                canvas.discardActiveObject();

                canvas.renderAll();

                saveHistory();

            }
        );

    }


    /* =====================================================
       UNDO / REDO
    ===================================================== */

    const undoButton =
        document.getElementById(
            "undoBtn"
        );


    const redoButton =
        document.getElementById(
            "redoBtn"
        );


    if (undoButton) {

        undoButton.addEventListener(
            "click",
            undo
        );

    }


    if (redoButton) {

        redoButton.addEventListener(
            "click",
            redo
        );

    }


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    const downloadButton =
        document.getElementById(
            "downloadBtn"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            () => {

                canvas.discardActiveObject();

                canvas.renderAll();


                const dataURL =
                    canvas.toDataURL({
                        format: "png",
                        multiplier: 1
                    });


                const link =
                    document.createElement("a");


                link.href =
                    dataURL;

                link.download =
                    "ads-maker-free-ad.png";


                document.body.appendChild(
                    link
                );


                link.click();

                link.remove();

            }
        );

    }


    /* =====================================================
       KEYBOARD DELETE
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            const active =
                canvas.getActiveObject();


            if (!active) {
                return;
            }


            if (
                event.key === "Delete" ||
                event.key === "Backspace"
            ) {

                if (
                    active.isEditing
                ) {
                    return;
                }


                canvas.remove(active);

                canvas.discardActiveObject();

                canvas.renderAll();

                saveHistory();

            }


            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "z"
            ) {

                event.preventDefault();

                if (event.shiftKey) {
                    redo();
                } else {
                    undo();
                }

            }

        }
    );


    /* =====================================================
       LEFT TOOL BUTTONS
    ===================================================== */

    const templatesButton =
        document.getElementById(
            "templatesBtn"
        );

    if (templatesButton) {

        templatesButton.onclick =
            () => {

                window.location.href =
                    "templates.html";

            };

    }


    const uploadButton =
        document.getElementById(
            "uploadBtn"
        );

    if (uploadButton) {

        uploadButton.onclick =
            () => {

                productInput?.click();

            };

    }


    const textButton =
        document.getElementById(
            "textBtn"
        );

    if (textButton) {

        textButton.onclick =
            () => {

                headlineButton?.click();

            };

    }


    /* =====================================================
       MOBILE BUTTONS
    ===================================================== */

    const mobileUpload =
        document.getElementById(
            "mobileUploadBtn"
        );

    if (mobileUpload) {

        mobileUpload.onclick =
            () => {

                productInput?.click();

            };

    }


    const mobileTemplates =
        document.getElementById(
            "mobileTemplatesBtn"
        );

    if (mobileTemplates) {

        mobileTemplates.onclick =
            () => {

                window.location.href =
                    "templates.html";

            };

    }


    const mobileText =
        document.getElementById(
            "mobileTextBtn"
        );

    if (mobileText) {

        mobileText.onclick =
            () => {

                headlineButton?.click();

            };

    }


    /* =====================================================
       LOAD TEMPLATE
    ===================================================== */

    loadTemplate(
        selectedTemplate
    );


    /* =====================================================
       FINAL RENDER
    ===================================================== */

    canvas.renderAll();

});
