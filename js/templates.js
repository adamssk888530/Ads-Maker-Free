// ============================================
// ADS MAKER FREE
// Templates Engine
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    const cards = [
        ...document.querySelectorAll(".template-card")
    ];

    const chips = [
        ...document.querySelectorAll(".category-chip")
    ];

    const searchInput =
        document.getElementById("templateSearch");

    const sortSelect =
        document.getElementById("templateSort");

    const grid =
        document.getElementById("templateGrid");

    const emptyState =
        document.getElementById("emptyState");

    const count =
        document.getElementById("templateCount");


    let selectedCategory = "all";


    // ==========================================
    // URL CATEGORY
    // ==========================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlCategory =
        params.get("category");


    if (urlCategory) {

        const normalized =
            urlCategory
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-");


        const matchingChip =
            chips.find(
                chip =>
                    chip.dataset.category ===
                    normalized
            );


        if (matchingChip) {

            selectedCategory =
                normalized;


            chips.forEach(chip => {

                chip.classList.remove(
                    "active"
                );

            });


            matchingChip.classList.add(
                "active"
            );

        }

    }


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    chips.forEach(chip => {

        chip.addEventListener(
            "click",
            () => {

                selectedCategory =
                    chip.dataset.category;


                chips.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                chip.classList.add(
                    "active"
                );


                filterTemplates();

            }
        );

    });


    // ==========================================
    // SEARCH
    // ==========================================

    searchInput?.addEventListener(
        "input",
        filterTemplates
    );


    // ==========================================
    // SORT
    // ==========================================

    sortSelect?.addEventListener(
        "change",
        () => {

            sortTemplates();

            filterTemplates();

        }
    );


    // ==========================================
    // FILTER
    // ==========================================

    function filterTemplates() {

        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        let visible = 0;


        cards.forEach(card => {

            const category =
                card.dataset.category ||
                "";

            const name =
                card.dataset.name ||
                "";

            const type =
                card.dataset.type ||
                "";


            const categoryMatch =
                selectedCategory === "all" ||
                category === selectedCategory;


            const searchMatch =
                !search ||
                name.includes(search) ||
                category.includes(search) ||
                type.includes(search);


            const show =
                categoryMatch &&
                searchMatch;


            card.style.display =
                show
                    ? ""
                    : "none";


            if (show) {
                visible++;
            }

        });


        updateCount(
            visible
        );


        if (emptyState) {

            emptyState.hidden =
                visible !== 0;

        }

    }


    // ==========================================
    // SORT
    // ==========================================

    function sortTemplates() {

        if (!grid) return;


        const sort =
            sortSelect
                ? sortSelect.value
                : "popular";


        const sorted =
            [...cards].sort(
                (a, b) => {

                    const aType =
                        a.dataset.type ||
                        "";

                    const bType =
                        b.dataset.type ||
                        "";


                    if (sort === "new") {

                        return (
                            aType === "new"
                                ? -1
                                : 1
                        );

                    }


                    if (sort === "sale") {

                        return (
                            aType === "sale"
                                ? -1
                                : 1
                        );

                    }


                    if (sort === "minimal") {

                        return (
                            aType === "minimal"
                                ? -1
                                : 1
                        );

                    }


                    return 0;

                }
            );


        sorted.forEach(card => {

            grid.appendChild(card);

        });

    }


    // ==========================================
    // COUNT
    // ==========================================

    function updateCount(number) {

        if (!count) return;


        count.textContent =
            `${number} Template${number === 1 ? "" : "s"}`;

    }


    // ==========================================
    // USE TEMPLATE
    // ==========================================

    document
        .querySelectorAll(".use-template")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const template =
                        button.dataset.template;


                    if (!template) {

                        window.location.href =
                            "editor.html";

                        return;

                    }


                    /*
                     * Send the selected template
                     * to the editor.
                     */

                    const url =
                        "editor.html?template=" +
                        encodeURIComponent(
                            template
                        );


                    window.location.href =
                        url;

                }
            );

        });


    // ==========================================
    // INITIALIZE
    // ==========================================

    sortTemplates();

    filterTemplates();

});
