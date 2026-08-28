/* =========================================================
   ADS MAKER FREE
   PREMIUM AI AD CREATOR
   FLUX.2 KLEIN 9B
   Real Product + AI Scene + Professional Ad
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

    let selectedStyle = "premium";

    let generatedAdImage = null;


    /* =====================================================
       BUTTON STATUS
    ===================================================== */

    function setGenerateText(text) {

        if (!generateBtn) return;

        generateBtn.textContent = text;
    }


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

                generatedAdImage = null;


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
                        item => {

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
       GENERATE AI AD
    ===================================================== */

    async function generateAIAd() {

        setGenerateText(
            "✨ AI yana ƙirƙirar advert..."
        );


        const scene =
            sceneInput?.value?.trim() || "";


        const data = {

            image:
                originalImage,

            headline:
                headline?.value?.trim() ||
                "NEW ARRIVAL",

            description:
                subheadline?.value?.trim() ||
                "PREMIUM STYLE • EVERYDAY COMFORT",

            price:
                price?.value?.trim() ||
                "",

            oldPrice:
                oldPrice?.value?.trim() ||
                "",

            discount:
                discount?.value?.trim() ||
                "",

            phone:
                phone?.value?.trim() ||
                "",

            buttonText:
                buttonText?.value?.trim() ||
                "SHOP NOW",

            style:
                selectedStyle,

            scene:
                scene

        };


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
                        JSON.stringify(data)
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
                "AI advertisement generation failed."
            );

        }


        if (!result.image) {

            throw new Error(
                "AI bai dawo da image ba."
            );

        }


        return result.image;

    }


    /* =====================================================
       DISPLAY AI RESULT
    ===================================================== */

    async function displayGeneratedAd(imageURL) {

        canvas.clear();

        canvas.backgroundColor =
            "#f1f3f7";


        const image =
            await fabric.Image.fromURL(
                imageURL
            );


        if (!image) {

            throw new Error(
                "An kasa nuna AI image."
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

            originX: "center",

            originY: "center",

            scaleX: scale,

            scaleY: scale,

            selectable: false,

            evented: false

        });


        canvas.add(image);

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


        if (!generateBtn) return;


        generateBtn.disabled = true;


        try {

            /*
             * STEP 1
             * AI GENERATION
             */

            generatedAdImage =
                await generateAIAd();


            /*
             * STEP 2
             * DISPLAY
             */

            setGenerateText(
                "✨ Ana nuna premium advert..."
            );


            await displayGeneratedAd(
                generatedAdImage
            );


            /*
             * DONE
             */

            setGenerateText(
                "✨ Generate Professional Ad"
            );


        } catch (error) {

            console.error(
                "AI Ad Error:",
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


        link.href =
            data;


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

            generatedAdImage = null;


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
        "Ads Maker Free Premium AI ready."
    );

});
