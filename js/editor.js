// ==========================================
// ADS MAKER FREE
// REAL EDITOR - STEP 1
// ==========================================

const canvasElement = document.getElementById("designCanvas");

const canvas = new fabric.Canvas(canvasElement, {
    width: 1080,
    height: 1080,
    backgroundColor: "#ffffff",
    preserveObjectStacking: true
});


// ==========================================
// EDITOR STATE
// ==========================================

let history = [];

let historyIndex = -1;

let isRestoring = false;


// ==========================================
// SAVE CANVAS STATE
// ==========================================

function saveState() {

    if (isRestoring) {
        return;
    }

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

    // Keep history small
    if (history.length > 30) {

        history.shift();

        historyIndex--;

    }

}


// ==========================================
// RESTORE CANVAS
// ==========================================

function restoreState(state) {

    isRestoring = true;

    canvas.loadFromJSON(
        JSON.parse(state),
        () => {

            canvas.renderAll();

            isRestoring = false;

        }
    );
// ==========================================
// LOAD SELECTED TEMPLATE
// ==========================================

function loadSelectedTemplate() {

    const savedTemplate =
        localStorage.getItem(
            "adsMakerTemplate"
        );

    if (!savedTemplate) {
        return;
    }

    let template;

    try {

        template =
            JSON.parse(savedTemplate);

    } catch (error) {

        console.error(
            "Invalid template data",
            error
        );

        return;

    }


    const category =
        template.category || "General";


    // Don't load twice
    if (
        canvas.getObjects().length > 0
    ) {
        return;
    }


    // ======================================
    // TEMPLATE BACKGROUND
    // ======================================

    let background = "#ffffff";

    if (category === "Shoes") {
        background = "#071b38";
    }

    if (category === "Phones") {
        background = "#0b4fa3";
    }

    if (category === "Food") {
        background = "#8c2414";
    }

    if (category === "Fashion") {
        background = "#5c153f";
    }

    if (category === "Beauty") {
        background = "#181818";
    }

    if (category === "Cars") {
        background = "#173d20";
    }


    canvas.backgroundColor =
        background;


    // ======================================
    // HEADLINE
    // ======================================

    const headline =
        new fabric.IText(
            getHeadline(category),
            {

                left: 55,

                top: 70,

                fontSize: 58,

                fontFamily:
                    "Arial",

                fontWeight:
                    "bold",

                fill: "#ffffff",

                selectable: true,

                cornerColor:
                    "#7135f2",

                cornerStrokeColor:
                    "#7135f2",

                borderColor:
                    "#7135f2",

                transparentCorners:
                    false

            }
        );


    canvas.add(headline);


    // ======================================
    // PRICE
    // ======================================

    const price =
        new fabric.IText(
            "₦35,000",
            {

                left: 55,

                top: 760,

                fontSize: 48,

                fontFamily:
                    "Arial",

                fontWeight:
                    "bold",

                fill: "#ffffff",

                cornerColor:
                    "#7135f2",

                cornerStrokeColor:
                    "#7135f2",

                borderColor:
                    "#7135f2",

                transparentCorners:
                    false

            }
        );


    canvas.add(price);


    // ======================================
    // DISCOUNT BADGE
    // ======================================

    const badge =
        new fabric.Circle({

            left: 780,

            top: 90,

            radius: 65,

            fill: "#ffd51a",

            originX: "center",

            originY: "center"

        });


    canvas.add(badge);


    const discount =
        new fabric.IText(
            "30% OFF",
            {

                left: 780,

                top: 78,

                originX: "center",

                fontSize: 25,

                fontWeight:
                    "bold",

                fill: "#111111"

            }
        );


    canvas.add(discount);


    // ======================================
    // SHOP NOW BUTTON
    // ======================================

    const button =
        new fabric.Rect({

            left: 55,

            top: 870,

            width: 200,

            height: 65,

            rx: 15,

            ry: 15,

            fill: "#ffd51a"

        });


    canvas.add(button);


    const buttonText =
        new fabric.IText(
            "SHOP NOW",
            {

                left: 88,

                top: 888,

                fontSize: 23,

                fontWeight:
                    "bold",

                fill: "#111111"

            }
        );


    canvas.add(buttonText);


    canvas.renderAll();

    saveState();


    // Remove saved selection
    localStorage.removeItem(
        "adsMakerTemplate"
    );

}


// ==========================================
// CATEGORY HEADLINES
// ==========================================

function getHeadline(category) {

    const headlines = {

        Shoes:
            "PREMIUM SNEAKERS",

        Phones:
            "NEW SMARTPHONE",

        Food:
            "DELICIOUS FOOD",

        Fashion:
            "NEW COLLECTION",

        Beauty:
            "LUXURY BEAUTY",

        Cars:
            "PREMIUM CAR",

        "Real Estate":
            "PROPERTY FOR SALE",

        Sale:
            "MEGA SALE"

    };


    return (
        headlines[category] ||
        "YOUR PRODUCT"
    );

}


// ==========================================
// RUN WHEN EDITOR OPENS
// ==========================================

loadSelectedTemplate();
}


// ==========================================
// UNDO
// ==========================================

function undo() {

    if (historyIndex <= 0) {

        return;

    }

    historyIndex--;

    restoreState(
        history[historyIndex]
    );

}


// ==========================================
// REDO
// ==========================================

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


// ==========================================
// UPLOAD IMAGE
// ==========================================

const uploadButton =
    document.getElementById(
        "uploadBtn"
    );

const imageInput =
    document.createElement("input");

imageInput.type = "file";

imageInput.accept =
    "image/png,image/jpeg,image/webp";

imageInput.style.display =
    "none";

document.body.appendChild(
    imageInput
);


uploadButton.addEventListener(
    "click",
    () => {

        imageInput.click();

    }
);


imageInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        if (!file) {
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            alert(
                "Please select an image."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                fabric.Image.fromURL(
                    event.target.result,
                    function (img) {

                        // Maximum image size
                        const maxWidth = 700;

                        const maxHeight = 650;


                        let scale =
                            Math.min(
                                maxWidth /
                                    img.width,

                                maxHeight /
                                    img.height
                            );


                        if (scale > 1) {
                            scale = 1;
                        }


                        img.set({

                            left:
                                (
                                    canvas.width -
                                    img.width *
                                    scale
                                ) / 2,

                            top:
                                210,

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

                    },

                    {
                        crossOrigin:
                            "anonymous"
                    }
                );

            };


        reader.readAsDataURL(file);


        // Allow same file to be uploaded again
        this.value = "";

    }
);


// ==========================================
// ADD TEXT
// ==========================================

const textButton =
    document.getElementById(
        "textBtn"
    );


textButton.addEventListener(
    "click",
    () => {

        const text =
            new fabric.IText(
                "YOUR PRODUCT",
                {

                    left: 100,

                    top: 80,

                    fontSize: 60,

                    fontFamily:
                        "Arial",

                    fontWeight:
                        "bold",

                    fill:
                        "#171827",

                    cornerColor:
                        "#7135f2",

                    cornerStrokeColor:
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

        text.enterEditing();

        canvas.renderAll();

        saveState();

    }
);


// ==========================================
// DELETE SELECTED OBJECT
// ==========================================

function deleteSelected() {

    const selected =
        canvas.getActiveObject();


    if (!selected) {

        return;

    }


    canvas.remove(
        selected
    );

    canvas.discardActiveObject();

    canvas.renderAll();

    saveState();

}


// Keyboard Delete
document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Delete"
        ) {

            deleteSelected();

        }

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
// INITIAL STATE
// ==========================================

saveState();


// ==========================================
// DOWNLOAD PNG
// ==========================================

const downloadButton =
    document.getElementById(
        "downloadBtn"
    );


downloadButton.addEventListener(
    "click",
    () => {

        canvas.discardActiveObject();

        canvas.renderAll();


        const dataURL =
            canvas.toDataURL({

                format:
                    "png",

                quality:
                    1,

                multiplier:
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


// ==========================================
// UNDO / REDO BUTTONS
// ==========================================

const undoButton =
    document.getElementById(
        "undoBtn"
    );

const redoButton =
    document.getElementById(
        "redoBtn"
    );


undoButton.addEventListener(
    "click",
    undo
);


redoButton.addEventListener(
    "click",
    redo
);
