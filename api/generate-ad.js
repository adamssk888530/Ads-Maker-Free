// ==========================================
// ADS MAKER FREE
// PREMIUM AI BACKGROUND GENERATOR
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
            style,
            scene
        } = req.body || {};

        // ======================================
        // STYLE
        // ======================================

        let stylePrompt = "";

        if (style === "sale") {

            stylePrompt = `
Use a powerful premium retail campaign style.
Elegant red and dark tones.
Strong studio lighting.
Energetic but sophisticated.
`;

        } else if (style === "minimal") {

            stylePrompt = `
Use a clean luxury minimalist style.
Soft white and neutral tones.
Elegant shadows.
Bright premium studio.
Lots of clean space.
`;

        } else {

            stylePrompt = `
Use a luxury premium commercial style.
Dark sophisticated environment.
Cinematic studio lighting.
Beautiful soft highlights.
Deep shadows.
Premium e-commerce atmosphere.
`;

        }

        // ======================================
        // SCENE PROMPT
        // ======================================

        const customScene =
            typeof scene === "string" &&
            scene.trim()
                ? scene.trim()
                : `
luxury modern product photography studio,
dark elegant background,
soft cinematic lighting,
subtle blue and purple ambient glow,
premium floor reflection,
realistic soft shadows,
high-end Nigerian e-commerce advertising environment
`;

        const prompt = `
Create a premium commercial advertising BACKGROUND.

IMPORTANT:
This image is ONLY the background environment.

Do NOT create a product.

Do NOT create a chair.

Do NOT create shoes.

Do NOT create a phone.

Do NOT create furniture.

Do NOT create people.

Do NOT create logos.

Do NOT create watermarks.

Do NOT create advertising text.

Do NOT create prices.

Do NOT create buttons.

Do NOT create fake words.

Leave a large clean central area where a real
product will be placed later.

The background must look like a professional
high-end commercial product photography scene.

${stylePrompt}

CUSTOM SCENE:
${customScene}

Composition:
- Square 1:1
- Premium commercial photography
- Realistic lighting
- Realistic floor and shadows
- Beautiful depth
- Clean composition
- Product-ready environment
- No text anywhere
- No objects that compete with the future product

Create a beautiful 1024 x 1024 background.
`;

        // ======================================
        // CLOUDFLARE REQUEST
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

        return res.status(200).json({

            success: true,

            image:
                `data:image/png;base64,${generatedImage}`

        });

    } catch (error) {

        console.error(
            "Generate background error:",
            error
        );

        return res.status(500).json({

            error:
                "Something went wrong while creating the AI background.",

            details:
                error.message

        });
    }
}
