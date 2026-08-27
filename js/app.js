// ============================================
// ADS MAKER FREE
// Main Website JavaScript
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Ads Maker Free loaded successfully");


    // ============================================
    // CREATE YOUR FIRST AD
    // ============================================

    const createButtons = document.querySelectorAll(
        ".primary-btn, .get-started"
    );

    createButtons.forEach((button) => {

        button.addEventListener("click", () => {

            openEditor();

        });

    });


    // ============================================
    // BROWSE TEMPLATES
    // ============================================

    const browseButton = document.querySelector(
        ".secondary-btn"
    );

    if (browseButton) {

        browseButton.addEventListener("click", () => {

            const templates =
                document.querySelector("#templates");

            if (templates) {

                templates.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    }


    // ============================================
    // CATEGORY BUTTONS
    // ============================================

    const categories =
        document.querySelectorAll(".category");

    categories.forEach((category) => {

        category.addEventListener("click", () => {

            const categoryName =
                category.querySelector("strong");

            if (categoryName) {

                const name =
                    categoryName.textContent.trim();

                openCategory(name);

            }

        });

    });


    // ============================================
    // VIEW ALL CATEGORIES
    // ============================================

    const viewAll =
        document.querySelector(".section-heading button");

    if (viewAll) {

        viewAll.addEventListener("click", () => {

            showMessage(
                "More categories will be available here."
            );

        });

    }

});


// ============================================
// OPEN EDITOR
// ============================================

function openEditor() {

    showMessage(
        "Editor is ready. We will connect the real editor next."
    );

    /*
       Later this button will open:

       editor.html

       where the user will:

       1. Choose template
       2. Upload product image
       3. Remove background
       4. Edit advert
       5. Download
       6. Share
    */
}


// ============================================
// OPEN CATEGORY
// ============================================

function openCategory(category) {

    console.log(
        "Selected category:",
        category
    );

    showMessage(
        category + " templates selected."
    );

}


// ============================================
// MESSAGE
// ============================================

function showMessage(message) {

    const oldMessage =
        document.querySelector(".site-message");

    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement("div");

    messageBox.className =
        "site-message";

    messageBox.textContent =
        message;


    messageBox.style.position =
        "fixed";

    messageBox.style.bottom =
        "25px";

    messageBox.style.left =
        "50%";

    messageBox.style.transform =
        "translateX(-50%)";

    messageBox.style.background =
        "#17172a";

    messageBox.style.color =
        "#ffffff";

    messageBox.style.padding =
        "12px 18px";

    messageBox.style.borderRadius =
        "10px";

    messageBox.style.fontSize =
        "13px";

    messageBox.style.fontWeight =
        "600";

    messageBox.style.zIndex =
        "99999";

    messageBox.style.boxShadow =
        "0 10px 30px rgba(0,0,0,.2)";


    document.body.appendChild(
        messageBox
    );


    setTimeout(() => {

        messageBox.remove();

    }, 2500);

}
