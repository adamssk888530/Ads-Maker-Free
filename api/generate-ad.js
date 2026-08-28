// ==========================================
// ADS MAKER FREE
// AI PREMIUM AD GENERATOR
// CLOUDFLARE WORKERS AI - FLUX.2 KLEIN 9B
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
                error: "Cloudflare AI credentials are missing."
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
                error: "No product image was provided."
            });
        }

        // --------------------------------------
        // Convert data URL to image Blob
        // --------------------------------------

        const match = image.match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
        );

        if (!match) {
            return res.status(400).json({
                error: "Invalid product image."
            });
        }

        const mimeType = match[1];

        const base64Data = match[2];

        const imageBuffer =
            Buffer.from(base64Data, "base64");

        const imageBlob =
            new Blob(
                [imageBuffer],
                {
                    type: mimeType
                }
            );

        // --------------------------------------
        // Professional advertising prompt
        // --------------------------------------

        const prompt = `
Create a premium professional square product advertisement.

Use the uploaded product image as the main product.
Keep the product recognizable, realistic and commercially attractive.

IMPORTANT:
- Do not replace the product.
- Do not invent a different product.
- Keep the product shape and important details.
- Make the product large and visually dominant.
- Create a realistic professional advertising environment.
- High-end commercial photography.
- Studio lighting.
- Beautiful reflections and realistic shadows.
- Premium color grading.
- Strong visual hierarchy.
- Modern Nigerian e-commerce advertising style.
- Clean composition.
- 1080x1080 social media advertisement.
- Leave enough clean space around the product for advertising information.

Advertisement information:

Headline: ${headline || "NEW ARRIVAL"}

Description: ${description || "PREMIUM STYLE • EVERYDAY COMFORT"}

Current price: ${price || ""}

Old price: ${oldPrice || ""}

Discount: ${discount || ""}

WhatsApp / Phone: ${phone || ""}

Button: ${buttonText || "SHOP NOW"}

Design style: ${style || "premium"}

Make the final image look like a professionally designed advertisement from a major fashion/e-commerce brand.

Do not create watermarks.
Do not create logos that were not provided.
Do not add random text.
`;

        // --------------------------------------
        // Cloudflare Workers AI
        // FLUX.2 Klein 9B
        // --------------------------------------

        const formData = new FormData();

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
            "input_image_0",
            imageBlob,
            "product.png"
        );

        const response =
            await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-2-klein-9b`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );

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

        const result =
            await response.json();

        // --------------------------------------
        // Cloudflare returns Base64 image
        // --------------------------------------

        const generatedImage =
            result?.result?.image;

        if (!generatedImage) {

            console.error(
                "Unexpected Cloudflare response:",
                result
            );

            return res.status(500).json({
                error:
                    "Cloudflare did not return an image."
            });
        }

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
