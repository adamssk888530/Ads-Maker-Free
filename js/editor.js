/* =========================================================
   ADS MAKER FREE
   REAL AD GENERATOR
   Fabric.js 6
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------------------------------
    // CHECK FABRIC
    // -----------------------------------------------------

    if (typeof fabric === "undefined") {
        console.error("Fabric.js bai load ba.");
        return;
    }


    // -----------------------------------------------------
    // CANVAS
    // -----------------------------------------------------

    const canvas = new fabric.Canvas("designCanvas", {
        width: 1080,
        height: 1080,
        selection: true,
        preserveObjectStacking: true
    });

    window.adsMakerCanvas = canvas;


    // -----------------------------------------------------
    // GET ELEMENTS
    // -----------------------------------------------------

    const productUploadBtn =
        document.getElementById("productUploadBtn");

    const productImageInput =
        document.getElementById("productImageInput");

    const productPreview =
        document.getElementById("productPreview");

    const headlineInput =
        document.getElementById("headlineInput");

    const subheadlineInput =
        document.getElementById("subheadlineInput");

    const priceInput =
        document.getElementById("priceInput");

    const oldPriceInput =
        document.getElementById("oldPriceInput");

    const discountInput =
        document.getElementById("discountInput");

    const phoneInput =
        document.getElementById("phoneInput");

    const buttonTextInput =
        document.getElementById("buttonTextInput");

    const backgroundColor =
        document.getElementById("backgroundColor");

    const generateAdBtn =
        document.getElementById("generateAdBtn");

    const resetBtn =
        document.getElementById("resetBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const downloadBtnBottom =
        document.getElementById("downloadBtnBottom");

    const styleButtons =
        document.querySelectorAll(".style-option");


    // -----------------------------------------------------
    // STATE
    // -----------------------------------------------------

    let uploadedImageURL = null;

    let selectedStyle = "premium";


    // -----------------------------------------------------
    // DEFAULT VALUES
    // -----------------------------------------------------

    if (headlineInput) {
        headlineInput.value = "NEW ARRIVAL";
    }

    if (subheadlineInput) {
        subheadlineInput.value = "STYLE MEETS COMFORT";
    }

    if (priceInput) {
        priceInput.value = "₦35,000";
    }

    if (oldPriceInput) {
        oldPriceInput.value = "₦50,000";
    }

    if (discountInput) {
        discountInput.value = "30% OFF";
    }

    if (phoneInput) {
        phoneInput.value = "080 1234 5678";
    }


    // -----------------------------------------------------
    // UPLOAD BUTTON
    // -----------------------------------------------------

    if (productUploadBtn && productImageInput) {

        productUploadBtn.addEventListener("click", () => {
            productImageInput.click();
        });

    }


    // -----------------------------------------------------
    // IMAGE UPLOAD
    // -----------------------------------------------------

    if (productImageInput) {

        productImageInput.addEventListener(
            "change",
            (event) => {

                const file =
                    event.target.files[0];

                if (!file) {
                    return;
                }


                if (!file.type.startsWith("image/")) {

                    alert(
                        "Da fatan zaɓi hoto PNG, JPG ko WEBP."
                    );

                    return;
                }


                const reader =
                    new FileReader();


                reader.onload = () => {

                    uploadedImageURL =
                        reader.result;


                    showProductPreview(
                        uploadedImageURL
                    );


                    productUploadBtn.classList.add(
                        "has-image"
                    );


                    productUploadBtn.innerHTML = `
                        <span class="upload-icon">✓</span>
                        <strong>Product Image Added</strong>
                        <small>Click to change image</small>
                    `;

                };


                reader.readAsDataURL(file);

            }
        );

    }


    // -----------------------------------------------------
    // PREVIEW IMAGE
    // -----------------------------------------------------

    function showProductPreview(imageURL) {

        if (!productPreview) {
            return;
        }


        productPreview.innerHTML = "";


        const img =
            document.createElement("img");


        img.src = imageURL;

        img.alt = "Product preview";


        img.style.width = "100%";

        img.style.height = "180px";

        img.style.objectFit = "contain";

        img.style.borderRadius = "14px";


        productPreview.appendChild(img);

    }


    // -----------------------------------------------------
    // STYLE BUTTONS
    // -----------------------------------------------------

    styleButtons.forEach((button) => {

        button.addEventListener("click", () => {

            styleButtons.forEach((item) => {
                item.classList.remove("active");
            });


            button.classList.add("active");


            selectedStyle =
                button.dataset.style ||
                "premium";

        });

    });


    // -----------------------------------------------------
    // HELPERS
    // -----------------------------------------------------

    function removeAllObjects() {

        canvas.getObjects().forEach((object) => {
            canvas.remove(object);
        });

        canvas.discardActiveObject();

    }


    function addText(
        text,
        options = {}
    ) {

        const textObject =
            new fabric.Textbox(
                text || "",
                {

                    left:
                        options.left ?? 70,

                    top:
                        options.top ?? 70,

                    width:
                        options.width ?? 900,

                    fontSize:
                        options.fontSize ?? 50,

                    fontFamily:
                        options.fontFamily ||
                        "Arial",

                    fontWeight:
                        options.fontWeight ||
                        "700",

                    fill:
                        options.fill ||
                        "#ffffff",

                    textAlign:
                        options.textAlign ||
                        "left",

                    lineHeight:
                        options.lineHeight ||
                        1.05,

                    selectable:
                        options.selectable ??
                        false,

                    evented:
                        options.evented ??
                        false,

                    editable:
                        false

                }
            );


        canvas.add(textObject);

        return textObject;

    }


    function addRect(options = {}) {

        const rect =
            new fabric.Rect({

                left:
                    options.left ?? 0,

                top:
                    options.top ?? 0,

                width:
                    options.width ?? 100,

                height:
                    options.height ?? 100,

                fill:
                    options.fill ?? "#ffffff",

                rx:
                    options.rx ?? 0,

                ry:
                    options.ry ?? 0,

                selectable:
                    options.selectable ??
                    false,

                evented:
                    options.evented ??
                    false

            });


        canvas.add(rect);

        return rect;

    }


    function addCircle(options = {}) {

        const circle =
            new fabric.Circle({

                left:
                    options.left ?? 0,

                top:
                    options.top ?? 0,

                radius:
                    options.radius ?? 50,

                fill:
                    options.fill ?? "#ffffff",

                stroke:
                    options.stroke,

                strokeWidth:
                    options.strokeWidth ?? 0,

                originX:
                    options.originX ||
                    "left",

                originY:
                    options.originY ||
                    "top",

                selectable:
                    options.selectable ??
                    false,

                evented:
                    options.evented ??
                    false

            });


        canvas.add(circle);

        return circle;

    }


    // -----------------------------------------------------
    // GRADIENT BACKGROUND
    // -----------------------------------------------------

    function createBackground() {

        let color =
            backgroundColor?.value ||
            "#061b4f";


        let secondColor =
            "#020617";


        if (selectedStyle === "sale") {

            color =
                "#8b0000";

            secondColor =
                "#190000";

        }


        if (selectedStyle === "minimal") {

            color =
                "#f4f4f4";

            secondColor =
                "#ffffff";

        }


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
                                color: color
                            },

                            {
                                offset: 0.55,
                                color: color
                            },

                            {
                                offset: 1,
                                color: secondColor
                            }

                        ]

                    }),

                selectable: false,

                evented: false

            });


        canvas.add(background);

        canvas.sendObjectToBack(background);

    }


    // -----------------------------------------------------
    // DECORATIVE GLOW
    // -----------------------------------------------------

    function createGlow() {

        if (selectedStyle === "minimal") {
            return;
        }


        addCircle({

            left: 800,

            top: 340,

            radius: 260,

            fill:
                selectedStyle === "sale"
                    ? "rgba(255,70,30,0.12)"
                    : "rgba(0,130,255,0.15)",

            originX: "center",

            originY: "center"

        });


        addCircle({

            left: 260,

            top: 700,

            radius: 230,

            fill:
                selectedStyle === "sale"
                    ? "rgba(255,20,20,0.12)"
                    : "rgba(30,70,255,0.12)",

            originX: "center",

            originY: "center"

        });

    }


    // -----------------------------------------------------
    // DISCOUNT BADGE
    // -----------------------------------------------------

    function createDiscount() {

        const discount =
            discountInput?.value.trim();


        if (!discount) {
            return;
        }


        const badge =
            addCircle({

                left: 850,

                top: 230,

                radius: 82,

                fill: "#ffd21a",

                stroke: "#ffffff",

                strokeWidth: 4,

                originX: "center",

                originY: "center"

            });


        addText(

            discount,

            {

                left: 775,

                top: 198,

                width: 150,

                fontSize: 29,

                fontWeight: "900",

                fill: "#111111",

                textAlign: "center"

            }

        );

    }


    // -----------------------------------------------------
    // PRODUCT IMAGE
    // -----------------------------------------------------

    function addProductImage(imageURL) {

        return fabric.Image
            .fromURL(imageURL)
            .then((image) => {

                if (!image.width || !image.height) {
                    return;
                }


                const maxWidth = 780;

                const maxHeight = 510;


                const scaleX =
                    maxWidth / image.width;


                const scaleY =
                    maxHeight / image.height;


                const scale =
                    Math.min(
                        scaleX,
                        scaleY
                    );


                image.set({

                    left: 540,

                    top: 570,

                    originX: "center",

                    originY: "center",

                    scaleX: scale,

                    scaleY: scale,

                    angle: 0,

                    selectable: true,

                    evented: true,

                    cornerColor: "#7437ff",

                    borderColor: "#7437ff",

                    transparentCorners: false,

                    padding: 8

                });


                canvas.add(image);

                canvas.bringObjectToFront(image);


                // Soft shadow

                image.set({

                    shadow:
                        new fabric.Shadow({

                            color:
                                "rgba(0,0,0,0.45)",

                            blur: 28,

                            offsetX: 0,

                            offsetY: 18

                        })

                });


                return image;

            });

    }


    // -----------------------------------------------------
    // PRICE AREA
    // -----------------------------------------------------

    function createPriceArea() {

        const price =
            priceInput?.value.trim();


        const oldPrice =
            oldPriceInput?.value.trim();


        if (!price) {
            return;
        }


        const priceBox =
            addRect({

                left: 55,

                top: 820,

                width: 390,

                height: 105,

                fill:
                    selectedStyle === "minimal"
                        ? "#111111"
                        : "#ffd21a",

                rx: 22,

                ry: 22

            });


        addText(

            price,

            {

                left: 80,

                top: 838,

                width: 340,

                fontSize: 56,

                fontWeight: "900",

                fill:
                    selectedStyle === "minimal"
                        ? "#ffffff"
                        : "#111111"

            }

        );


        if (oldPrice) {

            addText(

                oldPrice,

                {

                    left: 470,

                    top: 850,

                    width: 230,

                    fontSize: 30,

                    fontWeight: "700",

                    fill: "#ffffff"

                }

            );

        }

    }


    // -----------------------------------------------------
    // SHOP BUTTON
    // -----------------------------------------------------

    function createShopButton() {

        const buttonText =
            buttonTextInput?.value.trim() ||
            "SHOP NOW";


        addRect({

            left: 55,

            top: 955,

            width: 275,

            height: 72,

            fill: "#ffd21a",

            rx: 36,

            ry: 36

        });


        addText(

            buttonText,

            {

                left: 82,

                top: 976,

                width: 220,

                fontSize: 27,

                fontWeight: "900",

                fill: "#111111",

                textAlign: "center"

            }

        );

    }


    // -----------------------------------------------------
    // WHATSAPP
    // -----------------------------------------------------

    function createWhatsApp() {

        const phone =
            phoneInput?.value.trim();


        if (!phone) {
            return;
        }


        addCircle({

            left: 390,

            top: 991,

            radius: 32,

            fill: "#20d366",

            originX: "center",

            originY: "center"

        });


        addText(

            "WA",

            {

                left: 366,

                top: 1005,

                width: 48,

                fontSize: 17,

                fontWeight: "900",

                fill: "#ffffff",

                textAlign: "center"

            }

        );


        addText(

            phone,

            {

                left: 440,

                top: 995,

                width: 470,

                fontSize: 29,

                fontWeight: "700",

                fill: "#ffffff"

            }

        );

    }


    // -----------------------------------------------------
    // GENERATE AD
    // -----------------------------------------------------

    async function generateAd() {

        if (!uploadedImageURL) {

            alert(
                "Da farko ka upload product image."
            );

            return;

        }


        if (generateAdBtn) {

            generateAdBtn.disabled = true;

            generateAdBtn.innerHTML =
                "✨ Generating Ad...";

        }


        try {

            removeAllObjects();


            createBackground();

            createGlow();


            // ---------------------------------------------
            // TOP BADGE
            // ---------------------------------------------

            addRect({

                left: 55,

                top: 50,

                width: 185,

                height: 45,

                fill:
                    selectedStyle === "minimal"
                        ? "#111111"
                        : "#ef3028",

                rx: 8,

                ry: 8

            });


            addText(

                selectedStyle === "sale"
                    ? "BIG SALE"
                    : "NEW ARRIVAL",

                {

                    left: 72,

                    top: 61,

                    width: 150,

                    fontSize: 21,

                    fontWeight: "900",

                    fill: "#ffffff"

                }

            );


            // ---------------------------------------------
            // HEADLINE
            // ---------------------------------------------

            const headline =
                headlineInput?.value.trim() ||
                "NEW ARRIVAL";


            addText(

                headline,

                {

                    left: 55,

                    top: 120,

                    width: 720,

                    fontSize: 72,

                    fontWeight: "900",

                    fill:
                        selectedStyle === "minimal"
                            ? "#111111"
                            : "#ffffff",

                    lineHeight: 0.95

                }

            );


            // ---------------------------------------------
            // SUBHEADLINE
            // ---------------------------------------------

            const subheadline =
                subheadlineInput?.value.trim();


            if (subheadline) {

                addText(

                    subheadline,

                    {

                        left: 60,

                        top: 300,

                        width: 650,

                        fontSize: 27,

                        fontWeight: "600",

                        fill:
                            selectedStyle === "minimal"
                                ? "#333333"
                                : "#eeeeee"

                    }

                );

            }


            // ---------------------------------------------
            // DISCOUNT
            // ---------------------------------------------

            createDiscount();


            // ---------------------------------------------
            // PRODUCT
            // ---------------------------------------------

            await addProductImage(
                uploadedImageURL
            );


            // ---------------------------------------------
            // PRICE
            // ---------------------------------------------

            createPriceArea();


            // ---------------------------------------------
            // SHOP NOW
            // ---------------------------------------------

            createShopButton();


            // ---------------------------------------------
            // WHATSAPP
            // ---------------------------------------------

            createWhatsApp();


            // ---------------------------------------------
            // FINISH
            // ---------------------------------------------

            canvas.renderAll();


        } catch (error) {

            console.error(
                "Generate error:",
                error
            );


            alert(
                "An samu matsala wajen ƙirƙirar advert."
            );

        } finally {

            if (generateAdBtn) {

                generateAdBtn.disabled = false;

                generateAdBtn.innerHTML =
                    "✨ Generate Professional Ad";

            }

        }

    }


    // -----------------------------------------------------
    // GENERATE BUTTON
    // -----------------------------------------------------

    if (generateAdBtn) {

        generateAdBtn.addEventListener(
            "click",
            generateAd
        );

    }


    // -----------------------------------------------------
    // DOWNLOAD
    // -----------------------------------------------------

    function downloadAd() {

        if (canvas.getObjects().length === 0) {

            alert(
                "Da farko ka danna Generate Professional Ad."
            );

            return;

        }


        canvas.discardActiveObject();

        canvas.renderAll();


        const dataURL =
            canvas.toDataURL({

                format: "png",

                quality: 1,

                multiplier: 1

            });


        const link =
            document.createElement("a");


        link.href = dataURL;

        link.download =
            "ads-maker-free-ad.png";


        document.body.appendChild(link);

        link.click();

        link.remove();

    }


    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            downloadAd
        );

    }


    if (downloadBtnBottom) {

        downloadBtnBottom.addEventListener(
            "click",
            downloadAd
        );

    }


    // -----------------------------------------------------
    // RESET
    // -----------------------------------------------------

    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            () => {

                removeAllObjects();

                canvas.renderAll();

                uploadedImageURL = null;


                if (productPreview) {

                    productPreview.innerHTML = `
                        <span>No image selected</span>
                    `;

                }


                if (productUploadBtn) {

                    productUploadBtn.classList.remove(
                        "has-image"
                    );

                    productUploadBtn.innerHTML = `
                        <span class="upload-icon">↑</span>
                        <strong>Upload Product Image</strong>
                        <small>PNG, JPG or WEBP</small>
                    `;

                }


                if (productImageInput) {
                    productImageInput.value = "";
                }

            }
        );

    }


    // -----------------------------------------------------
    // BACKGROUND COLOR
    // -----------------------------------------------------

    if (backgroundColor) {

        backgroundColor.addEventListener(
            "input",
            () => {

                // Idan an riga an generate,
                // sake generate domin sabon color.

                if (uploadedImageURL) {
                    generateAd();
                }

            }
        );

    }


    // -----------------------------------------------------
    // INPUT LIVE GENERATION
    // -----------------------------------------------------

    const detailInputs = [
        headlineInput,
        subheadlineInput,
        priceInput,
        oldPriceInput,
        discountInput,
        phoneInput,
        buttonTextInput
    ];


    detailInputs.forEach((input) => {

        if (!input) {
            return;
        }


        input.addEventListener(
            "change",
            () => {

                if (uploadedImageURL) {
                    generateAd();
                }

            }
        );

    });


    // -----------------------------------------------------
    // INITIAL EMPTY CANVAS
    // -----------------------------------------------------

    canvas.backgroundColor =
        "#f1f3f7";

    canvas.renderAll();


    console.log(
        "Ads Maker Free Real Ad Generator ready."
    );

});
