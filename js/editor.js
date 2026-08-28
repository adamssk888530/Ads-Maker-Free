/* =========================================================
   ADS MAKER FREE
   AI AD GENERATOR
   Background Removal + Professional Design
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof fabric === "undefined") {
        alert("Fabric.js bai load ba.");
        return;
    }

    const canvas = new fabric.Canvas("designCanvas", {
        width: 1080,
        height: 1080,
        backgroundColor: "#061b4f",
        preserveObjectStacking: true,
        selection: true
    });

    window.adsMakerCanvas = canvas;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const uploadBtn =
        document.getElementById("productUploadBtn");

    const imageInput =
        document.getElementById("productImageInput");

    const preview =
        document.getElementById("productPreview");

    const headline =
        document.getElementById("headlineInput");

    const subheadline =
        document.getElementById("subheadlineInput");

    const price =
        document.getElementById("priceInput");

    const oldPrice =
        document.getElementById("oldPriceInput");

    const discount =
        document.getElementById("discountInput");

    const phone =
        document.getElementById("phoneInput");

    const buttonText =
        document.getElementById("buttonTextInput");

    const bgColor =
        document.getElementById("backgroundColor");

    const generateBtn =
        document.getElementById("generateAdBtn");

    const resetBtn =
        document.getElementById("resetBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const downloadBottom =
        document.getElementById("downloadBtnBottom");

    const styleButtons =
        document.querySelectorAll(".style-option");


    /* =====================================================
       STATE
    ===================================================== */

    let originalImage = null;

    let cleanImage = null;

    let selectedStyle = "premium";


    /* =====================================================
       DEFAULT VALUES
    ===================================================== */

    headline.value =
        "NEW ARRIVAL";

    subheadline.value =
        "PREMIUM STYLE • EVERYDAY COMFORT";

    price.value =
        "₦35,000";

    oldPrice.value =
        "₦50,000";

    discount.value =
        "30% OFF";

    phone.value =
        "080 1234 5678";

    buttonText.value =
        "SHOP NOW";


    /* =====================================================
       UPLOAD
    ===================================================== */

    uploadBtn.addEventListener(
        "click",
        () => imageInput.click()
    );


    imageInput.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files[0];

            if (!file) return;


            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload = () => {

                originalImage =
                    reader.result;

                cleanImage = null;

                showPreview(
                    originalImage
                );

                uploadBtn.classList.add(
                    "has-image"
                );

                uploadBtn.innerHTML = `
                    <span class="upload-icon">✓</span>
                    <strong>Product Image Added</strong>
                    <small>Click to change image</small>
                `;

            };


            reader.readAsDataURL(file);

        }
    );


    /* =====================================================
       PREVIEW
    ===================================================== */

    function showPreview(src) {

        preview.innerHTML = "";

        const img =
            document.createElement("img");

        img.src = src;

        img.alt =
            "Product image";

        img.style.width =
            "100%";

        img.style.height =
            "180px";

        img.style.objectFit =
            "contain";

        img.style.borderRadius =
            "14px";

        preview.appendChild(img);

    }


    /* =====================================================
       STYLE
    ===================================================== */

    styleButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    styleButtons.forEach(
                        (item) =>
                            item.classList.remove(
                                "active"
                            )
                    );

                    button.classList.add(
                        "active"
                    );

                    selectedStyle =
                        button.dataset.style ||
                        "premium";

                }
            );

        }
    );


    /* =====================================================
       REMOVE BACKGROUND API
    ===================================================== */

    async function removeBackground(
        imageData
    ) {

        setGenerateText(
            "✨ Removing background..."
        );


        const response =
            await fetch(
                imageData
            );


        const blob =
            await response.blob();


        const formData =
            new FormData();


        formData.append(
            "image",
            blob,
            "product.png"
        );


        const apiResponse =
            await fetch(
                "/api/remove-background",
                {
                    method: "POST",
                    body: formData
                }
            );


        const result =
            await apiResponse.json();


        if (!apiResponse.ok) {

            throw new Error(
                result.error ||
                "Background removal failed."
            );

        }


        if (
            !result.image
        ) {

            throw new Error(
                "No transparent image returned."
            );

        }


        return result.image;

    }


    /* =====================================================
       CREATE TEXT
    ===================================================== */

    function addText(
        text,
        options = {}
    ) {

        const object =
            new fabric.Textbox(
                text || "",
                {

                    left:
                        options.left ?? 60,

                    top:
                        options.top ?? 60,

                    width:
                        options.width ?? 800,

                    fontSize:
                        options.fontSize ?? 50,

                    fontFamily:
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
                        false,

                    evented:
                        false

                }
            );


        canvas.add(object);

        return object;

    }


    /* =====================================================
       RECTANGLE
    ===================================================== */

    function addRect(
        options = {}
    ) {

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
                    options.fill ||
                    "#ffffff",

                rx:
                    options.rx ||
                    0,

                ry:
                    options.ry ||
                    0,

                selectable:
                    false,

                evented:
                    false

            });


        canvas.add(rect);

        return rect;

    }


    /* =====================================================
       CIRCLE
    ===================================================== */

    function addCircle(
        options = {}
    ) {

        const circle =
            new fabric.Circle({

                left:
                    options.left ?? 0,

                top:
                    options.top ?? 0,

                radius:
                    options.radius ?? 50,

                fill:
                    options.fill ||
                    "#ffffff",

                stroke:
                    options.stroke,

                strokeWidth:
                    options.strokeWidth ||
                    0,

                originX:
                    "center",

                originY:
                    "center",

                selectable:
                    false,

                evented:
                    false

            });


        canvas.add(circle);

        return circle;

    }


    /* =====================================================
       BACKGROUND
    ===================================================== */

    function createBackground() {

        let first =
            bgColor.value ||
            "#061b4f";

        let second =
            "#020617";


        if (
            selectedStyle ===
            "sale"
        ) {

            first =
                "#a90000";

            second =
                "#210000";

        }


        if (
            selectedStyle ===
            "minimal"
        ) {

            first =
                "#eeeeee";

            second =
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
                                color: first
                            },

                            {
                                offset: 0.5,
                                color: first
                            },

                            {
                                offset: 1,
                                color: second
                            }

                        ]

                    }),

                selectable: false,

                evented: false

            });


        canvas.add(background);

        canvas.sendObjectToBack(
            background
        );

    }


    /* =====================================================
       GLOW
    ===================================================== */

    function createGlow() {

        if (
            selectedStyle ===
            "minimal"
        ) {
            return;
        }


        addCircle({

            left: 850,

            top: 350,

            radius: 250,

            fill:
                selectedStyle ===
                "sale"
                    ? "rgba(255,50,30,.15)"
                    : "rgba(30,120,255,.15)"

        });


        addCircle({

            left: 220,

            top: 760,

            radius: 220,

            fill:
                selectedStyle ===
                "sale"
                    ? "rgba(255,20,20,.12)"
                    : "rgba(100,60,255,.12)"

        });

    }


    /* =====================================================
       PRODUCT
    ===================================================== */

    async function addProduct(
        imageURL
    ) {

        const image =
            await fabric.Image.fromURL(
                imageURL
            );


        const maxWidth =
            760;

        const maxHeight =
            500;


        const scale =
            Math.min(
                maxWidth /
                    image.width,

                maxHeight /
                    image.height
            );


        image.set({

            left: 540,

            top: 580,

            originX:
                "center",

            originY:
                "center",

            scaleX:
                scale,

            scaleY:
                scale,

            selectable:
                true,

            evented:
                true,

            cornerColor:
                "#7437ff",

            borderColor:
                "#7437ff",

            transparentCorners:
                false,

            padding:
                8,

            shadow:
                new fabric.Shadow({

                    color:
                        "rgba(0,0,0,.45)",

                    blur:
                        30,

                    offsetX:
                        0,

                    offsetY:
                        20

                })

        });


        canvas.add(image);

        canvas.bringObjectToFront(
            image
        );

    }


    /* =====================================================
       DISCOUNT
    ===================================================== */

    function createDiscount() {

        const value =
            discount.value.trim();

        if (!value) return;


        addCircle({

            left: 880,

            top: 190,

            radius: 78,

            fill: "#ffd21a",

            stroke: "#ffffff",

            strokeWidth: 4

        });


        addText(

            value,

            {

                left: 805,

                top: 160,

                width: 150,

                fontSize: 27,

                fontWeight:
                    "900",

                fill:
                    "#111111",

                textAlign:
                    "center"

            }

        );

    }


    /* =====================================================
       PRICE
    ===================================================== */

    function createPrice() {

        const currentPrice =
            price.value.trim();

        const previousPrice =
            oldPrice.value.trim();


        if (!currentPrice) return;


        addRect({

            left: 55,

            top: 820,

            width: 390,

            height: 105,

            fill:
                selectedStyle ===
                "minimal"
                    ? "#111111"
                    : "#ffd21a",

            rx: 20,

            ry: 20

        });


        addText(

            currentPrice,

            {

                left: 78,

                top: 838,

                width: 345,

                fontSize: 55,

                fontWeight:
                    "900",

                fill:
                    selectedStyle ===
                    "minimal"
                        ? "#ffffff"
                        : "#111111"

            }

        );


        if (previousPrice) {

            addText(

                previousPrice,

                {

                    left: 475,

                    top: 850,

                    width: 230,

                    fontSize: 29,

                    fontWeight:
                        "700",

                    fill:
                        "#ffffff"

                }

            );

        }

    }


    /* =====================================================
       CTA
    ===================================================== */

    function createCTA() {

        const text =
            buttonText.value.trim() ||
            "SHOP NOW";


        addRect({

            left: 55,

            top: 950,

            width: 260,

            height: 70,

            fill: "#ffd21a",

            rx: 35,

            ry: 35

        });


        addText(

            text,

            {

                left: 75,

                top: 970,

                width: 220,

                fontSize: 26,

                fontWeight:
                    "900",

                fill:
                    "#111111",

                textAlign:
                    "center"

            }

        );

    }


    /* =====================================================
       PHONE
    ===================================================== */

    function createPhone() {

        const number =
            phone.value.trim();

        if (!number) return;


        addCircle({

            left: 390,

            top: 985,

            radius: 31,

            fill: "#20d366"

        });


        addText(

            "WA",

            {

                left: 365,

                top: 999,

                width: 50,

                fontSize: 16,

                fontWeight:
                    "900",

                fill:
                    "#ffffff",

                textAlign:
                    "center"

            }

        );


        addText(

            number,

            {

                left: 440,

                top: 992,

                width: 500,

                fontSize: 27,

                fontWeight:
                    "700",

                fill:
                    "#ffffff"

            }

        );

    }


    /* =====================================================
       GENERATE
    ===================================================== */

    async function generateAd() {

        if (!originalImage) {

            alert(
                "Da farko ka upload product image."
            );

            return;

        }


        generateBtn.disabled =
            true;


        try {

            /*
             * REAL AI BACKGROUND REMOVAL
             */

            cleanImage =
                await removeBackground(
                    originalImage
                );


            setGenerateText(
                "✨ Creating your ad..."
            );


            /*
             * CLEAR CANVAS
             */

            canvas.clear();


            /*
             * BACKGROUND
             */

            createBackground();

            createGlow();


            /*
             * BADGE
             */

            addRect({

                left: 55,

                top: 50,

                width: 190,

                height: 45,

                fill:
                    selectedStyle ===
                    "minimal"
                        ? "#111111"
                        : "#ed3028",

                rx: 8,

                ry: 8

            });


            addText(

                selectedStyle ===
                "sale"
                    ? "BIG SALE"
                    : "NEW ARRIVAL",

                {

                    left: 72,

                    top: 61,

                    width: 160,

                    fontSize: 20,

                    fontWeight:
                        "900",

                    fill:
                        "#ffffff"

                }

            );


            /*
             * HEADLINE
             */

            addText(

                headline.value.trim() ||
                "NEW ARRIVAL",

                {

                    left: 55,

                    top: 125,

                    width: 720,

                    fontSize: 67,

                    fontWeight:
                        "900",

                    fill:
                        selectedStyle ===
                        "minimal"
                            ? "#111111"
                            : "#ffffff",

                    lineHeight:
                        .95

                }

            );


            /*
             * DESCRIPTION
             */

            if (
                subheadline.value.trim()
            ) {

                addText(

                    subheadline.value.trim(),

                    {

                        left: 60,

                        top: 295,

                        width: 650,

                        fontSize: 25,

                        fontWeight:
                            "600",

                        fill:
                            selectedStyle ===
                            "minimal"
                                ? "#333333"
                                : "#eeeeee"

                    }

                );

            }


            /*
             * DISCOUNT
             */

            createDiscount();


            /*
             * CLEAN PRODUCT
             */

            await addProduct(
                cleanImage
            );


            /*
             * PRICE
             */

            createPrice();


            /*
             * CTA
             */

            createCTA();


            /*
             * WHATSAPP
             */

            createPhone();


            canvas.renderAll();


            setGenerateText(
                "✨ Generate Professional Ad"
            );


        } catch (error) {

            console.error(
                "Ad generation error:",
                error
            );


            alert(
                "An samu matsala: " +
                error.message
            );


            setGenerateText(
                "✨ Generate Professional Ad"
            );

        } finally {

            generateBtn.disabled =
                false;

        }

    }


    /* =====================================================
       GENERATE BUTTON TEXT
    ===================================================== */

    function setGenerateText(
        text
    ) {

        if (generateBtn) {
            generateBtn.innerHTML =
                text;
        }

    }


    generateBtn.addEventListener(
        "click",
        generateAd
    );


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    function downloadAd() {

        canvas.discardActiveObject();

        canvas.renderAll();


        const data =
            canvas.toDataURL({

                format:
                    "png",

                quality:
                    1,

                multiplier:
                    1

            });


        const link =
            document.createElement("a");


        link.href =
            data;


        link.download =
            "ads-maker-free.png";


        document.body.appendChild(
            link
        );


        link.click();

        link.remove();

    }


    downloadBtn?.addEventListener(
        "click",
        downloadAd
    );


    downloadBottom?.addEventListener(
        "click",
        downloadAd
    );


    /* =====================================================
       RESET
    ===================================================== */

    resetBtn?.addEventListener(
        "click",
        () => {

            originalImage = null;

            cleanImage = null;


            canvas.clear();

            canvas.backgroundColor =
                "#f1f3f7";


            canvas.renderAll();


            imageInput.value = "";


            preview.innerHTML =
                "<span>No image selected</span>";


            uploadBtn.classList.remove(
                "has-image"
            );


            uploadBtn.innerHTML = `
                <span class="upload-icon">↑</span>
                <strong>Upload Product Image</strong>
                <small>PNG, JPG or WEBP</small>
            `;

        }
    );


    /* =====================================================
       START
    ===================================================== */

    canvas.backgroundColor =
        "#f1f3f7";

    canvas.renderAll();


    console.log(
        "Ads Maker Free AI Generator ready."
    );

});
