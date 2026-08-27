// ==========================================
// ADS MAKER FREE
// REAL BACKGROUND REMOVAL API
// VERCEL SERVERLESS FUNCTION
// ==========================================

export default async function handler(req, res) {

    // Allow only POST requests
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }


    try {

        // API key stays on the server.
        // NEVER put this key inside editor.js.
        const apiKey =
            process.env.REMOVE_BG_API_KEY;


        if (!apiKey) {

            return res.status(500).json({
                error:
                    "REMOVE_BG_API_KEY is not configured."
            });

        }


        // Expect JSON containing a data URL.
        const { image } = req.body || {};


        if (!image) {

            return res.status(400).json({
                error:
                    "No image was provided."
            });

        }


        // --------------------------------------
        // Convert data URL to binary
        // --------------------------------------

        const match =
            image.match(
                /^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/
            );


        if (!match) {

            return res.status(400).json({
                error:
                    "Invalid image format."
            });

        }


        const mimeType =
            match[1];

        const base64Data =
            match[2];


        const imageBuffer =
            Buffer.from(
                base64Data,
                "base64"
            );


        // --------------------------------------
        // Send image to remove.bg
        // --------------------------------------

        const formData =
            new FormData();


        const blob =
            new Blob(
                [
                    imageBuffer
                ],
                {
                    type: mimeType
                }
            );


        formData.append(
            "image_file",
            blob,
            "product-image"
        );


        formData.append(
            "size",
            "auto"
        );


        const response =
            await fetch(
                "https://api.remove.bg/v1.0/removebg",
                {
                    method: "POST",

                    headers: {
                        "X-Api-Key":
                            apiKey
                    },

                    body:
                        formData
                }
            );


        // --------------------------------------
        // Handle API error
        // --------------------------------------

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "remove.bg error:",
                errorText
            );


            return res.status(
                response.status
            ).json({
                error:
                    "Background removal failed.",
                details:
                    errorText
            });

        }


        // --------------------------------------
        // Get transparent PNG
        // --------------------------------------

        const resultBuffer =
            Buffer.from(
                await response.arrayBuffer()
            );


        const resultBase64 =
            resultBuffer.toString(
                "base64"
            );


        // --------------------------------------
        // Return transparent PNG
        // --------------------------------------

        return res.status(200).json({

            success: true,

            image:
                `data:image/png;base64,${resultBase64}`

        });


    } catch (error) {

        console.error(
            "Server error:",
            error
        );


        return res.status(500).json({

            error:
                "Something went wrong while removing the background."

        });

    }

}
