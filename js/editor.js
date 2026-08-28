/* =========================================================
   ADS MAKER FREE
   PROFESSIONAL AI AD GENERATOR
   REMOVE BACKGROUND + PREMIUM SCENE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof fabric === "undefined") {
        alert("Fabric.js bai load ba.");
        return;
    }


    /* =====================================================
       CANVAS
    ===================================================== */

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

    const generateSceneBtn =
        document.getElementById("generateSceneBtn");

    const scenePromptInput =
        document.getElementById("scenePromptInput");

    const sceneStatus =
        document.getElementById("sceneStatus");

    const resetBtn =
        document.getElementById("resetBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const downloadBottom =
        document.getElementById("downloadBtnBottom");

    const styleButtons =
        document.querySelectorAll(".style-option");

    const scenePresets =
        document.querySelectorAll(".scene-preset");


    /* =====================================================
       STATE
    ===================================================== */

    let originalImage = null;

    let cleanImage = null;

    let aiSceneImage = null;

    let selectedStyle = "premium";


    /* =====================================================
       DEFAULT VALUES
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

    if (scenePromptInput)
        scenePromptInput.value =
            "Luxury premium product studio, dark navy background, dramatic lighting, elegant platform, realistic soft shadows, high-end commercial photography";


    /* =====================================================
       UPLOAD
    ===================================================== */

    uploadBtn?.addEventListener(
        "click",
        () => {
            imageInput?.click();
        }
    );


    imageInput?.addEventListener(
        "change",
        (event) => {

            const file =
                event.target.files?.[0];

            if (!file) return;


            if (!file.type.startsWith("image/")) {

                alert(
                    "Da fatan zaɓi PNG, JPG ko WEBP."
                );

                return;
            }


            const reader =
                new FileReader();


            reader.onload = () => {

                originalImage =
                    reader.result;

                cleanImage = null;

                aiSceneImage = null;


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


            reader.onerror = () => {

                alert(
                    "An samu matsala wajen karanta hoton."
                );

            };


            reader.readAsDataURL(file);

        }
    );


    /* =====================================================
       PRODUCT PREVIEW
    ===================================================== */

    function showPreview(src) {

        if (!preview) return;


        preview.innerHTML = "";


        const img =
            document.createElement("img");


        img.src =
            src;

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
       STYLE BUTTONS
    ===================================================== */

    styleButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    styleButtons.forEach(
                        (item) => {
                            item.classList.remove(
                                "active"
                            );
                        }
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
       SCENE PRESETS
    ===================================================== */

    scenePresets.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    scenePresets.forEach(
                        (item) => {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const prompt =
                        button.dataset.prompt;


                    if (
                        scenePromptInput &&
                        prompt
                    ) {

                        scenePromptInput.value =
                            prompt;

                    }

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

        if (!imageData) {

            throw new Error(
                "Babu product image."
            );

        }


        setGenerateText(
            "✨ Removing background..."
        );


        const response =
            await fetch(
                "/api/remove-background",
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            image:
                                imageData
                        })

                }
            );


        let result;


        try {

            result =
                await response.json();

        } catch {

            throw new Error(
                "Server bai dawo da JSON ba."
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
       AI SCENE GENERATOR
       
       IMPORTANT:
       Wannan endpoint zai kasance:
       
       /api/generate-ad
       
       idan muka haɗa image-generation provider.
    ===================================================== */

    async function generateAIScene(
        productImage,
        prompt
    ) {

        if (!productImage) {

            throw new Error(
                "Da farko ka upload product image."
            );

        }


        if (!prompt) {

            throw new Error(
                "Rubuta irin scene ɗin da kake so."
            );

        }


        setSceneStatus(
            "✨ AI is creating your premium scene..."
        );


        /*
         * Wannan yana jiran backend ɗinmu:
         *
         * POST /api/generate-ad
         *
         * body:
         *
         * {
         *   image: "...",
         *   prompt: "..."
         * }
         *
         * Za mu haɗa backend ɗin a mataki na gaba.
         */


        const response =
            await fetch(
                "/api/generate-ad",
                {

                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            image:
                                productImage,

                            prompt:
                                prompt

                        })

                }
            );


        let result;


        try {

            result =
                await response.json();

        } catch {

            throw new Error(
                "AI server bai dawo da JSON ba."
            );

        }


        if (!response.ok) {

            throw new Error(
                result.error ||
                "AI scene generation failed."
            );

        }


        if (!result.image) {

            throw new Error(
                "AI bai dawo da image ba."
            );

        }


        aiSceneImage =
            result.image;


        hideSceneStatus();


        return aiSceneImage;

    }


    /* =====================================================
       TEXT HELPER
    ===================================================== */

    function addText(
        value,
        options = {}
    ) {

        const object =
            new fabric.Textbox(
                value || "",
                {

                    left:
                        options.left ?? 60,

                    top:
                        options.top ?? 60,

                    width:
                        options.width ?? 800,

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

        const object =
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

                stroke:
                    options.stroke ||
                    null,

                strokeWidth:
                    options.strokeWidth ||
                    0,

                selectable:
                    false,

                evented:
                    false

            });


        canvas.add(object);


        return object;

    }


    /* =====================================================
       CIRCLE
    ===================================================== */

    function addCircle(
        options = {}
    ) {

        const object =
            new fabric.Circle({

                left:
                    options.left ?? 0,

                top:
                    options.top ?? 0,

                radius:
                    options.radius ?? 50,

                originX:
                    "center",

                originY:
                    "center",

                fill:
                    options.fill ||
                    "#ffffff",

                stroke:
                    options.stroke ||
                    null,

                strokeWidth:
                    options.strokeWidth ||
                    0,

                selectable:
                    false,

                evented:
                    false

            });


        canvas.add(object);


        return object;

    }


    /* =====================================================
       PREMIUM BACKGROUND
    ===================================================== */

    function createPremiumBackground() {

        let first =
            bgColor?.value ||
            "#071b52";

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

                        type:
                            "linear",

                        coords: {

                            x1: 0,

                            y1: 0,

                            x2: 1080,

                            y2: 1080

                        },

                        colorStops: [

                            {
                                offset:
                                    0,

                                color:
                                    first

                            },

                            {
                                offset:
                                    .55,

                                color:
                                    first

                            },

                            {
                                offset:
                                    1,

                                color:
                                    second

                            }

                        ]

                    }),

                selectable:
                    false,

                evented:
                    false

            });


        canvas.add(
            background
        );


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

            left:
                850,

            top:
                340,

            radius:
                270,

            fill:
                selectedStyle ===
                "sale"

                    ? "rgba(255,50,30,.16)"

                    : "rgba(20,100,255,.16)"

        });


        addCircle({

            left:
                180,

            top:
                800,

            radius:
                220,

            fill:
                selectedStyle ===
                "sale"

                    ? "rgba(255,20,20,.12)"

                    : "rgba(90,50,255,.13)"

        });

    }


    /* =====================================================
       PREMIUM HEADER
    ===================================================== */

    function createHeader() {

        const badge =
            selectedStyle ===
            "sale"

                ? "LIMITED SALE"

                : "NEW ARRIVAL";


        addRect({

            left:
                55,

            top:
                45,

            width:
                210,

            height:
                48,

            fill:
                selectedStyle ===
                "minimal"

                    ? "#111111"

                    : "#ef3028",

            rx:
                9,

            ry:
                9

        });


        addText(
            badge,
            {

                left:
                    73,

                top:
                    58,

                width:
                    175,

                fontSize:
                    20,

                fontWeight:
                    "900",

                fill:
                    "#ffffff"

            }
        );

    }


    /* =====================================================
       HEADLINE
    ===================================================== */

    function createHeadline() {

        const value =
            headline?.value?.trim() ||
            "NEW ARRIVAL";


        addText(
            value,
            {

                left:
                    55,

                top:
                    120,

                width:
                    710,

                fontSize:
                    72,

                fontWeight:
                    "900",

                fill:
                    selectedStyle ===
                    "minimal"

                        ? "#111111"

                        : "#ffffff",

                lineHeight:
                    .9

            }
        );

    }


    /* =====================================================
       SUBHEADLINE
    ===================================================== */

    function createSubheadline() {

        const value =
            subheadline?.value?.trim();


        if (!value)
            return;


        addText(
            value,
            {

                left:
                    60,

                top:
                    295,

                width:
                    650,

                fontSize:
                    25,

                fontWeight:
                    "600",

                fill:
                    selectedStyle ===
                    "minimal"

                        ? "#333333"

                        : "#eeeeee",

                charSpacing:
                    4

            }
        );

    }


    /* =====================================================
       DISCOUNT BADGE
    ===================================================== */

    function createDiscount() {

        const value =
            discount?.value?.trim();


        if (!value)
            return;


        addCircle({

            left:
                880,

            top:
                190,

            radius:
                82,

            fill:
                "#ffd21a",

            stroke:
                "#ffffff",

            strokeWidth:
                5

        });


        addText(
            value,
            {

                left:
                    800,

                top:
                    160,

                width:
                    160,

                fontSize:
                    28,

                fontWeight:
                    "900",

                fill:
                    "#111111",

                textAlign:
                    "center",

                lineHeight:
                    .95

            }
        );

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


        if (
            !image ||
            !image.width ||
            !image.height
        ) {

            throw new Error(
                "Product image ba ta load ba."
            );

        }


        const maxWidth =
            800;

        const maxHeight =
            510;


        const scale =
            Math.min(

                maxWidth /
                    image.width,

                maxHeight /
                    image.height

            );


        image.set({

            left:
                540,

            top:
                575,

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
                        35,

                    offsetX:
                        0,

                    offsetY:
                        22

                })

        });


        canvas.add(
            image
        );


        canvas.bringObjectToFront(
            image
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


        if (!current)
            return;


        addRect({

            left:
                55,

            top:
                820,

            width:
                400,

            height:
                105,

            fill:
                selectedStyle ===
                "minimal"

                    ? "#111111"

                    : "#ffd21a",

            rx:
                20,

            ry:
                20

        });


        addText(
            current,
            {

                left:
                    80,

                top:
                    838,

                width:
                    350,

                fontSize:
                    55,

                fontWeight:
                    "900",

                fill:
                    selectedStyle ===
                    "minimal"

                        ? "#ffffff"

                        : "#111111"

            }
        );


        if (previous) {

            addText(
                previous,
                {

                    left:
                        480,

                    top:
                        852,

                    width:
                        250,

                    fontSize:
                        29,

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

        const value =
            buttonText?.value?.trim() ||
            "SHOP NOW";


        addRect({

            left:
                55,

            top:
                950,

            width:
                280,

            height:
                72,

            fill:
                "#ffd21a",

            rx:
                36,

            ry:
                36

        });


        addText(
            value,
            {

                left:
                    75,

                top:
                    971,

                width:
                    240,

                fontSize:
                    27,

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
       WHATSAPP
    ===================================================== */

    function createPhone() {

        const number =
            phone?.value?.trim();


        if (!number)
            return;


        addCircle({

            left:
                405,

            top:
                985,

            radius:
                31,

            fill:
                "#20d366"

        });


        addText(
            "WA",
            {

                left:
                    380,

                top:
                    999,

                width:
                    50,

                fontSize:
                    16,

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

                left:
                    450,

                top:
                    992,

                width:
                    450,

                fontSize:
                    27,

                fontWeight:
                    "800",

                fill:
                    "#ffffff"

            }
        );

    }


    /* =====================================================
       GENERATE PROFESSIONAL AD
    ===================================================== */

    async function generateAd() {

        if (!originalImage) {

            alert(
                "Da farko ka upload product image."
            );

            return;
        }


        if (generateBtn)
            generateBtn.disabled =
                true;


        try {

            /*
             * 1. REMOVE BACKGROUND
             */

            cleanImage =
                await removeBackground(
                    originalImage
                );


            setGenerateText(
                "✨ Building premium ad..."
            );


            /*
             * 2. CLEAR
             */

            canvas.clear();


            /*
             * 3. BACKGROUND
             */

            createPremiumBackground();

            createGlow();


            /*
             * 4. HEADER
             */

            createHeader();


            /*
             * 5. TEXT
             */

            createHeadline();

            createSubheadline();


            /*
             * 6. DISCOUNT
             */

            createDiscount();


            /*
             * 7. PRODUCT
             */

            await addProduct(
                cleanImage
            );


            /*
             * 8. PRICE
             */

            createPrice();


            /*
             * 9. CTA
             */

            createCTA();


            /*
             * 10. WHATSAPP
             */

            createPhone();


            canvas.renderAll();


            setGenerateText(
                "✨ Generate Professional Ad"
            );


        } catch (error) {

            console.error(
                "Generate error:",
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
                generateBtn.disabled =
                    false;

        }

    }


    /* =====================================================
       AI SCENE BUTTON
    ===================================================== */

    generateSceneBtn?.addEventListener(
        "click",
        async () => {

            if (!originalImage) {

                alert(
                    "Da farko ka upload product image."
                );

                return;
            }


            const prompt =
                scenePromptInput?.value?.trim();


            if (!prompt) {

                alert(
                    "Rubuta bayanin scene ɗin."
                );

                return;
            }


            generateSceneBtn.disabled =
                true;


            try {

                await generateAIScene(
                    originalImage,
                    prompt
                );


                /*
                 * Idan AI scene ya dawo,
                 * za mu nuna shi a canvas.
                 */

                canvas.clear();


                const scene =
                    await fabric.Image.fromURL(
                        aiSceneImage
                    );


                const scale =
                    Math.max(
                        1080 / scene.width,
                        1080 / scene.height
                    );


                scene.set({

                    left:
                        540,

                    top:
                        540,

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
                        false

                });


                canvas.add(
                    scene
                );


                canvas.sendObjectToBack(
                    scene
                );


                /*
                 * Saka clean product a gaba
                 */

                if (!cleanImage) {

                    cleanImage =
                        await removeBackground(
                            originalImage
                        );

                }


                await addProduct(
                    cleanImage
                );


                createHeader();

                createHeadline();

                createSubheadline();

                createDiscount();

                createPrice();

                createCTA();

                createPhone();


                canvas.renderAll();


                hideSceneStatus();


            } catch (error) {

                console.error(
                    "AI scene error:",
                    error
                );


                alert(
                    "AI Scene: " +
                    error.message
                );


                hideSceneStatus();

            } finally {

                generateSceneBtn.disabled =
                    false;

            }

        }
    );


    /* =====================================================
       STATUS
    ===================================================== */

    function setSceneStatus(message) {

        if (!sceneStatus)
            return;


        sceneStatus.hidden =
            false;


        sceneStatus.textContent =
            message;

    }


    function hideSceneStatus() {

        if (!sceneStatus)
            return;


        sceneStatus.hidden =
            true;

    }


    /* =====================================================
       GENERATE BUTTON TEXT
    ===================================================== */

    function setGenerateText(textValue) {

        if (generateBtn) {

            generateBtn.innerHTML =
                textValue;

        }

    }


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    function downloadAd() {

        if (
            !canvas ||
            canvas.getObjects().length === 0
        ) {

            alert(
                "Da farko ka generate advert."
            );

            return;
        }


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
            "ads-maker-free-premium-ad.png";


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

            aiSceneImage = null;


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


            hideSceneStatus();

        }
    );


    /* =====================================================
       INITIAL CANVAS
    ===================================================== */

    canvas.backgroundColor =
        "#f1f3f7";

    canvas.renderAll();


    console.log(
        "Ads Maker Free Professional AI Generator ready."
    );

});
