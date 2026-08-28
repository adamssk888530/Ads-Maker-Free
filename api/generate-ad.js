// ==========================================
// ADS MAKER FREE
// PREMIUM AI AD GENERATOR
// CLOUDFLARE WORKERS AI
// FLUX.2 KLEIN 9B
// ==========================================

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const token =
            process.env.CLOUDFLARE_API_TOKEN;

        const accountId =
            process.env.CLOUDFLARE_ACCOUNT_ID;

        if (!token || !accountId) {
            return res.status(500).json({
                error:
                    "Cloudflare AI credentials are missing."
            });
        }

        const {
            image,
            headline,
            description,
            price,
            oldPrice,
            discount,
            phone,
            buttonText,
            style
        } = req.body || {};

        if (!image) {
            return res.status(400).json({
                error:
                    "No product image was provided."
            });
        }

        // ======================================
        // IMAGE
        // ======================================

        const match = image.match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
        );

        if (!match) {
            return res.status(400).json({
                error:
                    "Invalid product image."
            });
        }

        const mimeType = match[1];
        const base64Data = match[2];

        const imageBuffer =
            Buffer.from(
                base64Data,
                "base64"
            );

        const imageBlob =
            new Blob(
                [imageBuffer],
                {
                    type: mimeType
                }
            );

        // ======================================
        // STYLE
        // ======================================

        let stylePrompt = "";

        if (style === "sale") {

            stylePrompt = `
Create an energetic SALE campaign.
Strong commercial lighting.
Bold red and warm tones.
Premium retail campaign feeling.
Urgent but elegant.
`;

        } else if (style === "minimal") {

            stylePrompt = `
Create an elegant minimalist advertisement.
Clean white or soft neutral background.
Very subtle shadows.
Luxury editorial photography.
Lots of clean negative space.
`;

        } else {

            stylePrompt = `
Create a luxury premium advertisement.
Dark sophisticated background.
Beautiful studio lighting.
Soft cinematic highlights.
Realistic reflections.
Elegant premium e-commerce atmosphere.
`;

        }

        // ======================================
        // PROFESSIONAL AI PROMPT
        // ======================================

        const prompt = `
You are a world-class commercial advertising art director.

Create a premium 1:1 square product advertisement
using INPUT IMAGE 0 as the exact product reference.

PRODUCT PRESERVATION IS EXTREMELY IMPORTANT.

The product shown in INPUT IMAGE 0 must remain
the same product.

Do NOT replace the product.

Do NOT invent another product.

Do NOT change the product category.

Do NOT change its important physical features.

Do NOT add extra products.

Keep the original product recognizable.

Make the product the hero of the advertisement.

Place it naturally inside a beautiful professional
commercial environment.

Use realistic studio photography.

Use premium cinematic lighting.

Use realistic contact shadows.

Use subtle reflections where appropriate.

Use professional depth of field.

Use realistic materials.

Use sophisticated color grading.

Create strong visual hierarchy.

Leave clean space for advertisement information.

${stylePrompt}

PRODUCT:

Headline:
${headline || "NEW ARRIVAL"}

Description:
${description || "PREMIUM STYLE • EVERYDAY COMFORT"}

Current Price:
${price || ""}

Old Price:
${oldPrice || ""}

Discount:
${discount || ""}

WhatsApp / Phone:
${phone || ""}

CTA:
${buttonText || "SHOP NOW"}

IMPORTANT:

The uploaded product is the most important object.

Preserve its identity.

Do not turn a chair into a sofa.

Do not turn shoes into another type of shoes.

Do not turn a phone into another phone.

Do not turn furniture into another furniture.

Do not add people unless absolutely necessary.

Do not add random objects.

Do not create fake brand logos.

Do not create watermarks.

Do not create unrelated text.

Make it look like a professional advertisement
from a major Nigerian e-commerce brand.

Final composition:

1080 x 1080 square advertisement.

Product large and visually dominant.

Premium background.

Professional lighting.

Commercial photography.

Clean composition.

High-end advertising quality.
`;

        // ======================================
        // CLOUDFLARE FORM DATA
        // ======================================

        const formData =
            new FormData();

        formData.append(
            "prompt",
            prompt
        );

        formData.append(
            "width",
            "1024"
        );

        formData.append(
            "height",
            "1024"
        );

        formData.append(
            "guidance",
            "4"
        );

        formData.append(
            "input_image_0",
            imageBlob,
            "product.png"
        );

        // ======================================
        // CLOUDFLARE AI
        // ======================================

        const response =
            await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-2-klein-9b`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        formData
                }
            );

        // ======================================
        // ERROR
        // ======================================

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Cloudflare AI error:",
                errorText
            );

            return res.status(
                response.status
            ).json({
                error:
                    "Cloudflare AI generation failed.",
                details:
                    errorText
            });

        }

        // ======================================
        // RESULT
        // ======================================

        const result =
            await response.json();

        const generatedImage =
            result?.result?.image;

        if (!generatedImage) {

            console.error(
                "Cloudflare response:",
                result
            );

            return res.status(500).json({
                error:
                    "Cloudflare did not return an image."
            });

        }

        // ======================================
        // RETURN IMAGE
        // ======================================

        return res.status(200).json({

            success: true,

            image:
                `data:image/png;base64,${generatedImage}`

        });

    } catch (error) {

        console.error(
            "Generate ad error:",
            error
        );

        return res.status(500).json({

            error:
                "Something went wrong while generating the advertisement.",

            details:
                error.message

        });

    }

}
