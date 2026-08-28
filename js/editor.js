/* =========================================================
   ADS MAKER FREE
   AI PREMIUM AD GENERATOR
   Cloudflare Workers AI + FLUX.2 Klein 9B
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
        backgroundColor: "#f1f3f7",
        preserveObjectStacking: true
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
    let generatedImage = null;
    let selectedStyle = "premium";


    /* =====================================================
       DEFAULT VALUES
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
       UPLOAD PRODUCT
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
                    "Da fatan zaɓi image mai kyau."
                );

                return;
            }

            const reader =
                new FileReader();

            reader.onload = () => {

                originalImage =
                    reader.result;

                generatedImage = null;

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
       SHOW PRODUCT PREVIEW
    ===================================================== */

    function showPreview(src) {

        if (!preview) return;

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
       RESIZE IMAGE
       Cloudflare FLUX.2 reference images:
       keep input under 512px
    ===================================================== */

    async function prepareImageForAI(
        dataUrl
    ) {

        return new Promise(
            (resolve, reject) => {

                const img =
                    new Image();

                img.onload = () => {

                    const maxSize =
                        512;

                    const scale =
                        Math.min(
                            1,
                            maxSize /
                            Math.max(
                                img.width,
                                img.height
                            )
                        );

                    const width =
                        Math.max(
                            1,
                            Math.round(
                                img.width *
                                scale
                            )
                        );

                    const height =
                        Math.max(
                            1,
                            Math.round(
                                img.height *
                                scale
                            )
                        );

                    const tempCanvas =
                        document.createElement(
                            "canvas"
                        );

                    tempCanvas.width =
                        width;

                    tempCanvas.height =
                        height;

                    const ctx =
                        tempCanvas.getContext(
                            "2d"
                        );

                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );

                    resolve(
                        tempCanvas.toDataURL(
                            "image/png"
                        )
                    );

                };

                img.onerror =
                    () => {

                        reject(
                            new Error(
                                "An kasa shirya product image."
                            )
                        );

                    };

                img.src =
                    dataUrl;

            }
        );

    }


    /* =====================================================
       GENERATE AI AD
    ===================================================== */

    async function generateAIAd() {

        if (!originalImage) {

            alert(
                "Da farko ka upload product image."
            );

            return;

        }


        setGenerateText(
            "✨ Preparing product..."
        );


        try {

            /*
             * Prepare image for FLUX
             */

            const aiImage =
                await prepareImageForAI(
                    originalImage
                );


            setGenerateText(
                "✨ AI is creating your ad..."
            );


            /*
             * Send to our Vercel API
             *
             * IMPORTANT:
             * Cloudflare token ba ya cikin browser.
             */

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

                                image:
                                    aiImage,

                                headline:
                                    headline?.value?.trim(),

                                description:
                                    subheadline?.value?.trim(),

                                price:
                                    price?.value?.trim(),

                                oldPrice:
                                    oldPrice?.value?.trim(),

                                discount:
                                    discount?.value?.trim(),

                                phone:
                                    phone?.value?.trim(),

                                buttonText:
                                    buttonText?.value?.trim(),

                                style:
                                    selectedStyle

                            })
                    }
                );


            /*
             * Read response
             */

            let result;

            try {

                result =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Server bai dawo da JSON mai kyau ba."
                );

            }


            /*
             * API error
             */

            if (!response.ok) {

                console.error(
                    "Generate API error:",
                    result
                );

                throw new Error(
                    result.error ||
                    "AI generation failed."
                );

            }


            /*
             * Check generated image
             */

            if (!result.image) {

                throw new Error(
                    "AI bai dawo da image ba."
                );

            }


            generatedImage =
                result.image;


            /*
             * Show AI result
             */

            await showGeneratedAd(
                generatedImage
            );


            setGenerateText(
                "✨ Generate Professional Ad"
            );


        } catch (error) {

            console.error(
                "AI Ad Generation Error:",
                error
            );


            alert(
                "An samu matsala:\n\n" +
                error.message
            );


            setGenerateText(
                "✨ Generate Professional Ad"
            );

        }

    }


    /* =====================================================
       SHOW GENERATED IMAGE ON FABRIC
    ===================================================== */

    async function showGeneratedAd(
        imageURL
    ) {

        canvas.clear();

        canvas.backgroundColor =
            "#f1f3f7";


        const image =
            await fabric.Image.fromURL(
                imageURL
            );


        if (!image) {

            throw new Error(
                "An kasa load generated image."
            );

        }


        const scale =
            Math.min(
                1080 / image.width,
                1080 / image.height
            );


        image.set({

            left: 540,

            top: 540,

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


        canvas.add(image);

        canvas.renderAll();


        /*
         * Update preview thumbnail
         */

        if (preview) {

            preview.innerHTML = `
                <img
                    src="${imageURL}"
                    alt="Generated advertisement"
                    style="
                        width:100%;
                        height:180px;
                        object-fit:contain;
                        border-radius:14px;
                    "
                >
            `;

        }

    }


    /* =====================================================
       BUTTON TEXT
    ===================================================== */

    function setGenerateText(text) {

        if (generateBtn) {

            generateBtn.innerHTML =
                text;

        }

    }


    /* =====================================================
       GENERATE BUTTON
    ===================================================== */

    generateBtn?.addEventListener(
        "click",
        async () => {

            generateBtn.disabled =
                true;

            try {

                await generateAIAd();

            } finally {

                generateBtn.disabled =
                    false;

            }

        }
    );


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    function downloadAd() {

        if (!generatedImage) {

            alert(
                "Da farko ka ƙirƙiri AI advertisement."
            );

            return;

        }


        const link =
            document.createElement("a");


        link.href =
            generatedImage;


        link.download =
            "ads-maker-free-ai-ad.png";


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

            generatedImage = null;


            canvas.clear();

            canvas.backgroundColor =
                "#f1f3f7";

            canvas.renderAll();


            if (imageInput) {

                imageInput.value = "";

            }


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
        "Ads Maker Free AI Generator ready."
    );

});
