// ==========================================
// ADS MAKER FREE
// TEMPLATE PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const categories =
        document.querySelectorAll(".category");

    const cards =
        document.querySelectorAll(".template-card");

    const count =
        document.getElementById("templateCount");


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    categories.forEach((category) => {

        category.addEventListener("click", () => {

            // Remove active from all
            categories.forEach((item) => {
                item.classList.remove("active");
            });

            // Activate selected category
            category.classList.add("active");


            const selected =
                category.textContent
                    .trim()
                    .replace(
                        /^[^\w]+/,
                        ""
                    );


            let visible = 0;


            cards.forEach((card) => {

                const cardCategory =
                    card.dataset.category;


                if (
                    selected === "All" ||
                    cardCategory === selected
                ) {

                    card.style.display =
                        "block";

                    visible++;

                } else {

                    card.style.display =
                        "none";

                }

            });


            if (count) {

                count.textContent =
                    visible +
                    " Templates";

            }

        });

    });


    // ==========================================
    // USE TEMPLATE
    // ==========================================

    const useButtons =
        document.querySelectorAll(
            ".use-template"
        );


    useButtons.forEach((button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const card =
                    button.closest(
                        ".template-card"
                    );


                if (!card) {
                    return;
                }


                const category =
                    card.dataset.category;


                const name =
                    card
                        .querySelector(
                            ".template-info strong"
                        )
                        ?.textContent
                        .trim();


                // Save selected template
                localStorage.setItem(
                    "adsMakerTemplate",
                    JSON.stringify({
                        name: name || "Template",
                        category:
                            category || "General"
                    })
                );


                // Open real editor
                window.location.href =
                    "editor.html";

            }
        );

    });


    // ==========================================
    // PREVIEW CLICK
    // ==========================================

    cards.forEach((card) => {

        card.addEventListener(
            "dblclick",
            () => {

                const button =
                    card.querySelector(
                        ".use-template"
                    );

                if (button) {
                    button.click();
                }

            }
        );

    });


    // ==========================================
    // INITIAL COUNT
    // ==========================================

    if (count) {

        count.textContent =
            cards.length +
            " Templates";

    }

});
