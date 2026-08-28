/* =========================================================
   ADS MAKER FREE
   PREMIUM AI AD CREATOR
   AI Background + Real Product + Clean Text
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof fabric === "undefined") {
        alert("Fabric.js bai load ba.");
        return;
    }

    /* =====================================================
       CANVAS
    ===================================================== */

    const canvas =
        new fabric.Canvas("designCanvas", {
            width: 1080,
            height: 1080,
            backgroundColor: "#f1f3f7",
            preserveObjectStacking: true,
            selection: false
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

    const sceneInput =
        document.getElementById("sceneInput");


    /* =====================================================
       STATE
    ===================================================== */

    let originalImage = null;
    let cleanImage = null;
    let generatedBackground = null;

    let selectedStyle =
        "premium";


    /* =====================================================
       DEFAULTS
    ===================================================== */

    if (headline)
        headline.value = "NEW ARRIVAL";

    if (subheadline)
        subheadline.value =
            "PREMIUM STYLE • EVERYDAY COMFORT";

    if (price)
        price.value = "₦35,000";

    if (oldPrice)
        oldPrice.value = "₦50,000";

    if (discount)
        discount.value = "30% OFF";

    if (phone)
        phone.value = "080 1234 5678";

    if (buttonText)
        buttonText.value = "SHOP NOW";


    /* =====================================================
       UPLOAD
    ===================================================== */

    uploadBtn?.addEventListener(
        "click",
        () => imageInput?.click()
    );


    imageInput?.addEventListener(
        "change",
        event => {

            const file =
                event.target.files?.[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {

                alert(
                    "Da fatan zaɓi image mai kyau."
                );

                return;
            }

            const reader =
                new FileReader();

            reader.onload = () => {

                originalImage =
                    reader.result;

                cleanImage = null;
                generatedBackground = null;

                showPreview(
                    originalImage
                );

                uploadBtn?.classList.add(
                    "has-image"
                );

                if (uploadBtn) {

                    uploadBtn.innerHTML = `
                        <span class="upload-icon">✓</span>
                        <strong>Product Image Added</strong>
                        <small>Click to change image</small>
                    `;

                }
            };

            reader.readAsDataURL(file);

        }
    );


    /* =====================================================
       PREVIEW
    ===================================================== */

    function showPreview(src) {

        if (!preview) return;

        preview.innerHTML = `
            <img
                src="${src}"
                alt="Product"
                style="
                    width:100%;
                    height:180px;
                    object-fit:contain;
                    border-radius:14px;
                "
            >
        `;
    }


    /* =====================================================
       STYLE
    ===================================================== */

    styleButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    styleButtons.forEach(
                        item =>
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
       REMOVE BACKGROUND
    ===================================================== */

    async function removeBackground(
        imageData
    ) {

        setGenerateText(
            "✨ Removing background..."
        );

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
                            image: imageData
                        })
                }
            );

        let result;

        try {

            result =
                await response.json();

        } catch {

            throw new Error(
                "Remove background server error."
            );

        }

        if (!response.ok) {

            throw new Error(
                result.error ||
                "Background removal failed."
            );

        }

        if (!result.image) {

            throw new Error(
                "Transparent image bai dawo ba."
            );

        }

        return result.image;
    }


    /* =====================================================
       AI BACKGROUND
    ===================================================== */

    async function generateBackground() {

        setGenerateText(
            "✨ Creating AI scene..."
        );

        const scene =
            sceneInput?.value?.trim() || "";

        const response =
            await fetch(
                "/api/generate-ad",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            style:
                                selectedStyle,

                            scene:
                                scene

                        })
                }
            );

        let result;

        try {

            result =
                await response.json();

        } catch {

            throw new Error(
                "AI server bai dawo da response mai kyau ba."
            );
        }

        if (!response.ok) {

            throw new Error(
                result.error ||
                "AI background generation failed."
            );
        }

        if (!result.image) {

            throw new Error(
                "AI bai dawo da background ba."
            );
        }

        return result.image;
    }


    /* =====================================================
       ADD IMAGE
    ===================================================== */

    async function addImage(
        url,
        options = {}
    ) {

        const image =
            await fabric.Image.fromURL(
                url
            );

        if (!image) {
            throw new Error(
                "An kasa load image."
            );
        }

        image.set(options);

        canvas.add(image);

        return image;
    }


    /* =====================================================
       TEXT
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
       PRODUCT
    ===================================================== */

    async function addProduct(
        imageURL
    ) {

        const image =
            await fabric.Image.fromURL(
                imageURL
            );

        const maxWidth = 760;
        const maxHeight = 540;

        const scale =
            Math.min(
                maxWidth / image.width,
                maxHeight / image.height
            );

        image.set({

            left: 540,

            top: 560,

            originX:
                "center",

            originY:
                "center",

            scaleX:
                scale,

            scaleY:
                scale,

            selectable:
                false,

            evented:
                false,

            shadow:
                new fabric.Shadow({

                    color:
                        "rgba(0,0,0,.35)",

                    blur:
                        30,

                    offsetX:
                        0,

                    offsetY:
                        25
                })
        });

        canvas.add(image);

        canvas.bringObjectToFront(
            image
        );
    }


    /* =====================================================
       BADGE
    ===================================================== */

    function createBadge() {

        const label =
            selectedStyle === "sale"
                ? "BIG SALE"
                : "NEW ARRIVAL";

        addRect({

            left: 55,
            top: 50,
            width: 190,
            height: 45,

            fill:
                selectedStyle === "sale"
                    ? "#ed3028"
                    : "#7437ff",

            rx: 10,
            ry: 10
        });

        addText(
            label,
            {
                left: 70,
                top: 61,
                width: 165,
                fontSize: 19,
                fontWeight: "900"
            }
        );
    }


    /* =====================================================
       DISCOUNT
    ===================================================== */

    function createDiscount() {

        const value =
            discount?.value?.trim();

        if (!value) return;

        const circle =
            new fabric.Circle({

                left: 900,
                top: 165,

                radius: 70,

                originX:
                    "center",

                originY:
                    "center",

                fill:
                    "#ffd21a",

                stroke:
                    "#ffffff",

                strokeWidth:
                    4,

                selectable:
                    false,

                evented:
                    false
            });

        canvas.add(circle);

        addText(
            value,
            {
                left: 830,
                top: 150,
                width: 140,
                fontSize: 25,
                fontWeight: "900",
                fill: "#111111",
                textAlign: "center"
            }
        );
    }


    /* =====================================================
       PRICE
    ===================================================== */

    function createPrice() {

        const current =
            price?.value?.trim();

        const previous =
            oldPrice?.value?.trim();

        if (!current) return;

        addRect({

            left: 55,
            top: 820,
            width: 370,
            height: 90,

            fill:
                selectedStyle === "minimal"
                    ? "#111111"
                    : "#ffd21a",

            rx: 18,
            ry: 18
        });

        addText(
            current,
            {
                left: 75,
                top: 835,
                width: 330,
                fontSize: 48,
                fontWeight: "900",
                fill:
                    selectedStyle === "minimal"
                        ? "#ffffff"
                        : "#111111"
            }
        );

        if (previous) {

            addText(
                previous,
                {
                    left: 450,
                    top: 845,
                    width: 230,
                    fontSize: 27,
                    fontWeight: "700",
                    fill: "#ffffff"
                }
            );
        }
    }


    /* =====================================================
       CTA
    ===================================================== */

    function createCTA() {

        const text =
            buttonText?.value?.trim() ||
            "SHOP NOW";

        addRect({

            left: 55,
            top: 935,
            width: 270,
            height: 70,

            fill: "#ffd21a",

            rx: 35,
            ry: 35
        });

        addText(
            text,
            {
                left: 75,
                top: 954,
                width: 230,
                fontSize: 25,
                fontWeight: "900",
                fill: "#111111",
                textAlign: "center"
            }
        );
    }


    /* =====================================================
       PHONE
    ===================================================== */

    function createPhone() {

        const number =
            phone?.value?.trim();

        if (!number) return;

        addText(
            "WhatsApp",
            {
                left: 350,
                top: 958,
                width: 100,
                fontSize: 17,
                fontWeight: "900",
                fill: "#20d366"
            }
        );

        addText(
            number,
            {
                left: 455,
                top: 954,
                width: 300,
                fontSize: 22,
                fontWeight: "700",
                fill: "#ffffff"
            }
        );
    }


    /* =====================================================
       BUILD FINAL AD
    ===================================================== */

    async function buildFinalAd() {

        canvas.clear();

        /*
         * AI BACKGROUND
         */

        if (generatedBackground) {

            await addImage(
                generatedBackground,
                {
                    left: 0,
                    top: 0,
                    scaleX:
                        1080 / 1024,
                    scaleY:
                        1080 / 1024,
                    selectable: false,
                    evented: false
                }
            );

        } else {

            canvas.backgroundColor =
                bgColor?.value ||
                "#061b4f";
        }


        /*
         * BADGE
         */

        createBadge();


        /*
         * HEADLINE
         */

        addText(
            headline?.value?.trim() ||
            "NEW ARRIVAL",
            {

                left: 55,

                top: 115,

                width: 720,

                fontSize: 64,

                fontWeight: "900",

                fill:
                    selectedStyle === "minimal"
                        ? "#111111"
                        : "#ffffff",

                lineHeight: .95
            }
        );


        /*
         * DESCRIPTION
         */

        if (
            subheadline?.value?.trim()
        ) {

            addText(
                subheadline.value.trim(),
                {

                    left: 60,

                    top: 285,

                    width: 700,

                    fontSize: 25,

                    fontWeight: "600",

                    fill:
                        selectedStyle === "minimal"
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
         * REAL PRODUCT
         */

        await addProduct(
            cleanImage ||
            originalImage
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
         * PHONE
         */

        createPhone();


        canvas.renderAll();
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

        generateBtn.disabled = true;

        try {

            /*
             * STEP 1
             * REMOVE BACKGROUND
             */

            cleanImage =
                await removeBackground(
                    originalImage
                );


            /*
             * STEP 2
             * AI BACKGROUND
             */

            generatedBackground =
                await generateBackground();


            /*
             * STEP 3
             * COMBINE EVERYTHING
             */

            setGenerateText(
                "✨ Building premium ad..."
            );

            await buildFinalAd();


            setGenerateText(
                "✨ Generate Professional Ad"
            );

        } catch (error) {

            console.error(
                "Ad generation error:",
                error
            );

            alert(
                "An samu matsala:\n\n" +
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
       GENERATE BUTTON
    ===================================================== */

    generateBtn?.addEventListener(
        "click",
        generateAd
    );


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    function downloadAd() {

        if (!canvas.getObjects().length) {

            alert(
                "Da farko ka ƙirƙiri advertisement."
            );

            return;
        }

        canvas.discardActiveObject();

        canvas.renderAll();

        const data =
            canvas.toDataURL({
                format: "png",
                quality: 1,
                multiplier: 1
            });

        const link =
            document.createElement("a");

        link.href = data;

        link.download =
            "ads-maker-premium-ad.png";

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
            generatedBackground = null;

            canvas.clear();

            canvas.backgroundColor =
                "#f1f3f7";

            canvas.renderAll();

            if (imageInput)
                imageInput.value = "";

            if (preview)
                preview.innerHTML =
                    "<span>No image selected</span>";

            uploadBtn?.classList.remove(
                "has-image"
            );

            if (uploadBtn) {

                uploadBtn.innerHTML = `
                    <span class="upload-icon">↑</span>
                    <strong>Upload Product Image</strong>
                    <small>PNG, JPG or WEBP</small>
                `;
            }
        }
    );


    /* =====================================================
       START
    ===================================================== */

    canvas.backgroundColor =
        "#f1f3f7";

    canvas.renderAll();

    console.log(
        "Ads Maker Free Premium AI ready."
    );

});
