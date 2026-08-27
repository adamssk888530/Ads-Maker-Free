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

        button.addEventListener("click", (event) => {

            event.preventDefault();

            openEditor();

        });

    });


    // ============================================
    // BROWSE TEMPLATES
    // ============================================

    const browseButtons = document.querySelectorAll(
        ".secondary-btn"
    );

    browseButtons.forEach((button) => {

        button.addEventListener("click", (event) => {

            event.preventDefault();

            openTemplates();

        });

    });


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

        viewAll.addEventListener("click", (event) => {

            event.preventDefault();

            openTemplates();

        });

    }

});


// ============================================
// OPEN REAL EDITOR
// ============================================

function openEditor() {

    window.location.href = "editor.html";

}


// ============================================
// OPEN TEMPLATES
// ============================================

function openTemplates() {

    window.location.href = "templates.html";

}


// ============================================
// OPEN CATEGORY
// ============================================

function openCategory(category) {

    console.log(
        "Selected category:",
        category
    );


    /*
     * Send the selected category to
     * templates.html.
     *
     * Example:
     * templates.html?category=Shoes
     */

    const url =
        "templates.html?category=" +
        encodeURIComponent(category);


    window.location.href = url;

}
