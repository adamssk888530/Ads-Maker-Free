/* =====================================================
   ADS MAKER FREE
   PROFESSIONAL TEMPLATES JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const categories =
        document.querySelectorAll(".category");

    const cards =
        document.querySelectorAll(".template-card");

    const searchInput =
        document.querySelector("#searchTemplates");

    const sortSelect =
        document.querySelector("#sortTemplates");

    const useButtons =
        document.querySelectorAll(".use-template");

    const loadMoreButton =
        document.querySelector("#loadMore");

    const themeButton =
        document.querySelector("#themeBtn");


    /* =================================================
       CATEGORY FILTER
    ================================================= */

    categories.forEach((category) => {

        category.addEventListener("click", () => {

            categories.forEach((item) => {
                item.classList.remove("active");
                item.classList.remove("active-category");
            });

            category.classList.add("active");

            const selectedCategory =
                category.dataset.category;

            filterTemplates(
                selectedCategory,
                searchInput ? searchInput.value : ""
            );

        });

    });


    /* =================================================
       SEARCH
    ================================================= */

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const activeCategory =
                document.querySelector(
                    ".category.active"
                );

            const category =
                activeCategory
                    ? activeCategory.dataset.category
                    : "all";

            filterTemplates(
                category,
                searchInput.value
            );

        });

    }


    /* =================================================
       USE TEMPLATE
    ================================================= */

    useButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const template =
                button.dataset.template;

            if (!template) {
                return;
            }

            /*
                Send selected template
                to the editor.
            */

            const editorUrl =
                "editor.html?template=" +
                encodeURIComponent(template);

            window.location.href =
                editorUrl;

        });

    });


    /* =================================================
       SORT
    ================================================= */

    if (sortSelect) {

        sortSelect.addEventListener("change", () => {

            sortTemplates(
                sortSelect.value
            );

        });

    }


    /* =================================================
       LOAD MORE
    ================================================= */

    if (loadMoreButton) {

        loadMoreButton.addEventListener(
            "click",
            () => {

                showComingSoon();

            }
        );

    }


    /* =================================================
       THEME BUTTON
    ================================================= */

    if (themeButton) {

        themeButton.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-mode"
                );

            }
        );

    }


    /* =================================================
       INITIAL SORT
    ================================================= */

    sortTemplates("popular");

});


/* =====================================================
   FILTER TEMPLATES
===================================================== */

function filterTemplates(
    category,
    searchText
) {

    const cards =
        document.querySelectorAll(
            ".template-card"
        );

    const search =
        searchText
            .toLowerCase()
            .trim();


    cards.forEach((card) => {

        const cardCategory =
            card.dataset.category || "";

        const cardName =
            card.dataset.name || "";


        const categoryMatch =
            category === "all" ||
            cardCategory === category;


        const searchMatch =
            search === "" ||
            cardName
                .toLowerCase()
                .includes(search);


        if (
            categoryMatch &&
            searchMatch
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });


    updateTemplateCount();

}


/* =====================================================
   SORT TEMPLATES
===================================================== */

function sortTemplates(type) {

    const grid =
        document.querySelector(
            ".template-grid"
        );

    if (!grid) {
        return;
    }


    const cards =
        Array.from(
            grid.querySelectorAll(
                ".template-card"
            )
        );


    if (type === "new") {

        cards.reverse();

    }


    if (type === "sale") {

        cards.sort((a, b) => {

            const aText =
                a.innerText
                    .toLowerCase();

            const bText =
                b.innerText
                    .toLowerCase();

            const aSale =
                aText.includes("sale")
                    ? 1
                    : 0;

            const bSale =
                bText.includes("sale")
                    ? 1
                    : 0;

            return bSale - aSale;

        });

    }


    cards.forEach((card) => {

        grid.appendChild(card);

    });

}


/* =====================================================
   UPDATE COUNT
===================================================== */

function updateTemplateCount() {

    const visibleCards =
        document.querySelectorAll(
            ".template-card:not([style*='display: none'])"
        );

    const count =
        document.querySelector(
            ".section-title span"
        );

    if (count) {

        count.textContent =
            visibleCards.length +
            " Templates";

    }

}


/* =====================================================
   COMING SOON
===================================================== */

function showComingSoon() {

    const oldMessage =
        document.querySelector(
            ".template-message"
        );

    if (oldMessage) {
        oldMessage.remove();
    }


    const message =
        document.createElement("div");

    message.className =
        "template-message";

    message.textContent =
        "More professional templates are coming soon ✨";


    message.style.position =
        "fixed";

    message.style.left =
        "50%";

    message.style.bottom =
        "25px";

    message.style.transform =
        "translateX(-50%)";

    message.style.zIndex =
        "99999";

    message.style.padding =
        "13px 20px";

    message.style.borderRadius =
        "12px";

    message.style.background =
        "#171225";

    message.style.color =
        "#ffffff";

    message.style.fontSize =
        "13px";

    message.style.fontWeight =
        "700";

    message.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.25)";


    document.body.appendChild(
        message
    );


    setTimeout(() => {

        message.remove();

    }, 2500);

}
