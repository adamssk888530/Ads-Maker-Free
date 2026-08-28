/* =========================================================
   ADS MAKER FREE
   PROFESSIONAL AI AD GENERATOR
   1080 x 1080
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof fabric === "undefined") {
        alert("Fabric.js bai load ba.");
        return;
    }

    const canvas = new fabric.Canvas("designCanvas", {
        width: 1080,
        height: 1080,
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


    /* =====================================================
       STATE
    ===================================================== */

    let originalImage = null;
    let cleanImage = null;
    let selectedStyle = "premium";


    /* =====================================================
       DEFAULT DATA
    ===================================================== */

    if (headline)
        headline.value = "NEW ARRIVAL";

    if (subheadline)
        subheadline.value =
            "STYLE MEETS COMFORT";

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

    uploadBtn?.addEventListener("click", () => {
        imageInput?.click();
    });


    imageInput?.addEventListener("change", (event) => {

        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Da fatan zaɓi hoto.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {

            originalImage = reader.result;
            cleanImage = null;

            showPreview(originalImage);

            uploadBtn.classList.add("has-image");

            uploadBtn.innerHTML = `
                <span class="upload-icon">✓</span>
                <strong>Product Image Added</strong>
                <small>Click to change image</small>
            `;
        };

        reader.readAsDataURL(file);
    });


    /* =====================================================
       IMAGE PREVIEW
    ===================================================== */

    function showPreview(src) {

        if (!preview) return;

        preview.innerHTML = "";

        const img =
            document.createElement("img");

        img.src = src;
        img.alt = "Product image";

        img.style.width = "100%";
        img.style.height = "180px";
        img.style.objectFit = "contain";
        img.style.borderRadius = "14px";

        preview.appendChild(img);
    }


    /* =====================================================
       STYLE BUTTONS
    ===================================================== */

    styleButtons.forEach(button => {

        button.addEventListener("click", () => {

            styleButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");

            selectedStyle =
                button.dataset.style || "premium";
        });

    });


    /* =====================================================
       REMOVE BACKGROUND
       SEND JSON DATA URL TO VERCEL API
    ===================================================== */

    async function removeBackground(imageData) {

        setGenerateText("✨ Removing background...");

        const response = await fetch(
            "/api/remove-background",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    image: imageData
                })
            }
        );

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error(
                "Server bai dawo da sakamakon da ya dace ba."
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
                "Transparent image ba ta dawo ba."
            );
        }

        return result.image;
    }


    /* =====================================================
       TEXT HELPER
    ===================================================== */

    function text(
        value,
        options = {}
    ) {

        const obj =
            new fabric.Textbox(
                value || "",
                {
                    left: options.left ?? 60,
                    top: options.top ?? 60,
                    width: options.width ?? 900,

                    fontFamily:
                        options.fontFamily ||
                        "Arial",

                    fontSize:
                        options.fontSize ||
                        50,

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
                        1,

                    charSpacing:
                        options.charSpacing ||
                        0,

                    selectable: false,
                    evented: false
                }
            );

        canvas.add(obj);

        return obj;
    }


    /* =====================================================
       RECTANGLE
    ===================================================== */

    function rect(options = {}) {

        const obj =
            new fabric.Rect({

                left: options.left ?? 0,
                top: options.top ?? 0,

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

                stroke:
                    options.stroke || null,

                strokeWidth:
                    options.strokeWidth || 0,

                selectable: false,
                evented: false
            });

        canvas.add(obj);

        return obj;
    }


    /* =====================================================
       CIRCLE
    ===================================================== */

    function circle(options = {}) {

        const obj =
            new fabric.Circle({

                left:
                    options.left ?? 0,

                top:
                    options.top ?? 0,

                radius:
                    options.radius ?? 50,

                originX: "center",
                originY: "center",

                fill:
                    options.fill ||
                    "#ffffff",

                stroke:
                    options.stroke || null,

                strokeWidth:
                    options.strokeWidth || 0,

                selectable: false,
                evented: false
            });

        canvas.add(obj);

        return obj;
    }


    /* =====================================================
       BACKGROUND
    ===================================================== */

    function createBackground() {

        let first = "#071b52";
        let second = "#020617";

        if (selectedStyle === "sale") {
            first = "#c40000";
            second = "#180000";
        }

        if (selectedStyle === "minimal") {
            first = "#f3f3f3";
            second = "#ffffff";
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
                                offset: 0.55,
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

        canvas.sendObjectToBack(background);
    }


    /* =====================================================
       PROFESSIONAL GLOW
    ===================================================== */

    function createGlow() {

        if (selectedStyle === "minimal")
            return;

        circle({
            left: 850,
            top: 360,
            radius: 260,
            fill:
                selectedStyle === "sale"
                    ? "rgba(255,40,20,0.16)"
                    : "rgba(0,100,255,0.18)"
        });

        circle({
            left: 220,
            top: 800,
            radius: 230,
            fill:
                selectedStyle === "sale"
                    ? "rgba(255,0,0,0.13)"
                    : "rgba(80,60,255,0.13)"
        });

        circle({
            left: 600,
            top: 650,
            radius: 180,
            fill:
                selectedStyle === "sale"
                    ? "rgba(255,90,20,0.08)"
                    : "rgba(0,180,255,0.08)"
        });
    }


    /* =====================================================
       TOP BADGE
    ===================================================== */

    function createTopBadge() {

        const label =
            selectedStyle === "sale"
                ? "BIG SALE"
                : "NEW ARRIVAL";

        rect({
            left: 55,
            top: 48,
            width: 205,
            height: 48,
            fill:
                selectedStyle === "minimal"
                    ? "#111111"
                    : "#ef3028",
            rx: 9,
            ry: 9
        });

        text(label, {

            left: 70,
            top: 59,

            width: 175,

            fontSize: 21,

            fontWeight: "900",

            fill: "#ffffff"
        });
    }


    /* =====================================================
       HEADLINE
    ===================================================== */

    function createHeadline() {

        const value =
            headline?.value?.trim() ||
            "NEW ARRIVAL";

        text(value, {

            left: 55,
            top: 120,

            width: 720,

            fontSize: 76,

            fontWeight: "900",

            fill:
                selectedStyle === "minimal"
                    ? "#111111"
                    : "#ffffff",

            lineHeight: 0.92,

            charSpacing: -20
        });
    }


    /* =====================================================
       SUBHEADLINE
    ===================================================== */

    function createSubheadline() {

        const value =
            subheadline?.value?.trim();

        if (!value) return;

        text(value, {

            left: 60,
            top: 295,

            width: 650,

            fontSize: 26,

            fontWeight: "600",

            fill:
                selectedStyle === "minimal"
                    ? "#333333"
                    : "#eeeeee",

            charSpacing: 5
        });
    }


    /* =====================================================
       DISCOUNT BADGE
    ===================================================== */

    function createDiscount() {

        const value =
            discount?.value?.trim();

        if (!value) return;

        circle({

            left: 875,
            top: 185,

            radius: 83,

            fill: "#ffd21a",

            stroke: "#ffffff",

            strokeWidth: 5
        });

        text(value, {

            left: 800,
            top: 157,

            width: 150,

            fontSize: 28,

            fontWeight: "900",

            fill: "#111111",

            textAlign: "center",

            lineHeight: 0.95
        });
    }


    /* =====================================================
       PRODUCT IMAGE
    ===================================================== */

    async function addProduct(imageURL) {

        const image =
            await fabric.Image.fromURL(
                imageURL
            );

        if (!image || !image.width)
            throw new Error(
                "Product image ba ta load ba."
            );

        const maxWidth = 820;
        const maxHeight = 500;

        const scale =
            Math.min(
                maxWidth / image.width,
                maxHeight / image.height
            );

        image.set({

            left: 540,
            top: 575,

            originX: "center",
            originY: "center",

            scaleX: scale,
            scaleY: scale,

            selectable: true,
            evented: true,

            shadow:
                new fabric.Shadow({
                    color:
                        "rgba(0,0,0,0.45)",
                    blur: 35,
                    offsetX: 0,
                    offsetY: 22
                })
        });

        canvas.add(image);

        canvas.bringObjectToFront(image);
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

        rect({

            left: 55,
            top: 820,

            width: 390,
            height: 105,

            fill:
                selectedStyle === "minimal"
                    ? "#111111"
                    : "#ffd21a",

            rx: 20,
            ry: 20
        });

        text(current, {

            left: 80,
            top: 838,

            width: 340,

            fontSize: 56,

            fontWeight: "900",

            fill:
                selectedStyle === "minimal"
                    ? "#ffffff"
                    : "#111111"
        });

        if (previous) {

            text(previous, {

                left: 475,
                top: 850,

                width: 250,

                fontSize: 30,

                fontWeight: "700",

                fill: "#ffffff"
            });
        }
    }


    /* =====================================================
       CTA
    ===================================================== */

    function createCTA() {

        const value =
            buttonText?.value?.trim() ||
            "SHOP NOW";

        rect({

            left: 55,
            top: 950,

            width: 280,
            height: 72,

            fill: "#ffd21a",

            rx: 36,
            ry: 36
        });

        text(value, {

            left: 75,
            top: 970,

            width: 240,

            fontSize: 27,

            fontWeight: "900",

            fill: "#111111",

            textAlign: "center"
        });
    }


    /* =====================================================
       WHATSAPP
    ===================================================== */

    function createPhone() {

        const number =
            phone?.value?.trim();

        if (!number) return;

        circle({

            left: 405,
            top: 985,

            radius: 31,

            fill: "#20d366"
        });

        text("WA", {

            left: 380,
            top: 998,

            width: 50,

            fontSize: 16,

            fontWeight: "900",

            fill: "#ffffff",

            textAlign: "center"
        });

        text(number, {

            left: 450,
            top: 991,

            width: 450,

            fontSize: 28,

            fontWeight: "800",

            fill: "#ffffff"
        });
    }


    /* =====================================================
       GENERATE AD
    ===================================================== */

    async function generateAd() {

        if (!originalImage) {

            alert(
                "Da farko ka upload product image."
            );

            return;
        }

        if (generateBtn)
            generateBtn.disabled = true;

        try {

            /* REMOVE BACKGROUND */

            cleanImage =
                await removeBackground(
                    originalImage
                );


            setGenerateText(
                "✨ Creating professional ad..."
            );


            /* CLEAR */

            canvas.clear();


            /* BACKGROUND */

            createBackground();

            createGlow();


            /* TEXT */

            createTopBadge();

            createHeadline();

            createSubheadline();


            /* DISCOUNT */

            createDiscount();


            /* PRODUCT */

            await addProduct(
                cleanImage
            );


            /* PRICE */

            createPrice();


            /* CTA */

            createCTA();


            /* WHATSAPP */

            createPhone();


            canvas.renderAll();


            setGenerateText(
                "✨ Generate Professional Ad"
            );

        } catch (error) {

            console.error(
                "Generation error:",
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

            if (generateBtn)
                generateBtn.disabled = false;
        }
    }


    /* =====================================================
       BUTTON TEXT
    ===================================================== */

    function setGenerateText(value) {

        if (generateBtn)
            generateBtn.innerHTML = value;
    }


    generateBtn?.addEventListener(
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
                format: "png",
                quality: 1,
                multiplier: 1
            });

        const link =
            document.createElement("a");

        link.href = data;

        link.download =
            "ads-maker-free.png";

        document.body.appendChild(link);

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

            if (imageInput)
                imageInput.value = "";

            if (preview) {

                preview.innerHTML =
                    "<span>No image selected</span>";
            }

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
        "Ads Maker Free Professional Generator ready."
    );

});
