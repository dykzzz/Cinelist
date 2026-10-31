// =========================
// SIDE NAV TOGGLE
// =========================

const sideNav = document.getElementById("sideNav");
const navToggle = document.getElementById("sideNavHandle");

navToggle.addEventListener("click", () => {

    sideNav.classList.toggle("open");
    navToggle.classList.toggle("open");

});


// =========================
// DIARY: YEAR + FILTER PANEL (type & genre) + SORT + SEARCH
// =========================

const timeline = document.getElementById("diaryTimeline");
const searchInput = document.getElementById("diarySearch");
const diaryEntries = Array.from(document.querySelectorAll(".diary-entry"));
const emptyState = document.getElementById("diaryEmpty");

const yearButtons = document.querySelectorAll(".year-filter .filter");

const filterWrapper = document.getElementById("filterWrapper");
const filterBtn = document.getElementById("filterBtn");
const filterPanel = document.getElementById("filterPanel");
const typeChipsWrap = document.getElementById("typeChips");
const genreChipsWrap = document.getElementById("genreChips");
const countryChipsWrap = document.getElementById("countryChips");
const filterClearBtn = document.getElementById("filterClearBtn");

const sortWrapper = document.getElementById("sortWrapper");
const sortBtn = document.getElementById("sortBtn");
const sortPanel = document.getElementById("sortPanel");

const thisYear = String(new Date().getFullYear());

let activeYear = "all";
let activeType = "all";
let activeSort = "newest";
const selectedGenres = new Set();
const selectedCountries = new Set();

// Urutan asli DOM (judul bulan + entry), dipakai lagi kalau sort "Newest first"
const originalOrder = timeline
    ? Array.from(timeline.children).filter(
        (el) => el.classList.contains("month-title") || el.classList.contains("diary-entry")
      )
    : [];

bindGenreChips();
bindCountryChips();
bindYearButtons();
bindFilterPanel();
bindSortPanel();

if (searchInput) {
    searchInput.addEventListener("input", applyDiaryFilters);
}

applyDiaryFilters();


// ---------- YEAR ----------

function bindYearButtons() {

    yearButtons.forEach((button) => {

        button.addEventListener("click", () => {

            yearButtons.forEach((b) => {
                b.classList.remove("active");
                b.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            activeYear = button.dataset.year;

            applyDiaryFilters();

        });

    });

}


// ---------- FILTER PANEL (type + genre) ----------

function bindGenreChips() {

    if (!genreChipsWrap) return;

    const genreChips = genreChipsWrap.querySelectorAll(".chip[data-genre]");

    genreChips.forEach((chip) => {

        const genre = chip.dataset.genre;

        chip.addEventListener("click", () => {

            chip.classList.toggle("active");

            if (chip.classList.contains("active")) {
                selectedGenres.add(genre);
            } else {
                selectedGenres.delete(genre);
            }

            applyDiaryFilters();

        });

    });

}

function bindCountryChips() {

    if (!countryChipsWrap) return;

    const countryChips = countryChipsWrap.querySelectorAll(".chip[data-country]");

    countryChips.forEach((chip) => {

        const country = chip.dataset.country;

        chip.addEventListener("click", () => {

            chip.classList.toggle("active");

            if (chip.classList.contains("active")) {
                selectedCountries.add(country);
            } else {
                selectedCountries.delete(country);
            }

            applyDiaryFilters();

        });

    });

}

function bindFilterPanel() {

    if (!filterBtn || !filterPanel) return;

    filterBtn.addEventListener("click", () => {
        togglePanel(filterPanel, filterBtn);
        closePanel(sortPanel, sortBtn);
    });

    if (typeChipsWrap) {

        const typeChips = typeChipsWrap.querySelectorAll(".chip");

        typeChips.forEach((chip) => {

            chip.addEventListener("click", () => {

                typeChips.forEach((c) => c.classList.remove("active"));
                chip.classList.add("active");

                activeType = chip.dataset.type;

                applyDiaryFilters();

            });

        });

    }

    if (filterClearBtn) {

        filterClearBtn.addEventListener("click", () => {

            activeType = "all";
            selectedGenres.clear();
            selectedCountries.clear();

            if (typeChipsWrap) {
                typeChipsWrap.querySelectorAll(".chip").forEach((chip) => {
                    chip.classList.toggle("active", chip.dataset.type === "all");
                });
            }

            if (genreChipsWrap) {
                genreChipsWrap.querySelectorAll(".chip").forEach((chip) => {
                    chip.classList.remove("active");
                });
            }

            if (countryChipsWrap) {
                countryChipsWrap.querySelectorAll(".chip").forEach((chip) => {
                    chip.classList.remove("active");
                });
            }

            applyDiaryFilters();

        });

    }

}


// ---------- SORT ----------

function bindSortPanel() {

    if (!sortBtn || !sortPanel) return;

    sortBtn.addEventListener("click", () => {
        togglePanel(sortPanel, sortBtn);
        closePanel(filterPanel, filterBtn);
    });

    sortPanel.querySelectorAll("button[data-sort]").forEach((option) => {

        option.addEventListener("click", () => {

            sortPanel.querySelectorAll("button[data-sort]").forEach((o) => {
                o.classList.remove("active");
            });
            option.classList.add("active");

            activeSort = option.dataset.sort;
            sortBtn.innerHTML = `Sort: ${option.textContent.replace(" first", "")} <span class="caret">▾</span>`;

            reorderEntries();
            closePanel(sortPanel, sortBtn);
            applyDiaryFilters();

        });

    });

}

function reorderEntries() {

    if (!timeline || !emptyState) return;

    if (activeSort === "newest") {

        originalOrder.forEach((el) => timeline.insertBefore(el, emptyState));
        return;

    }

    const sorted = [...diaryEntries];

    if (activeSort === "oldest") {
        sorted.sort((a, b) => a.dataset.date.localeCompare(b.dataset.date));
    } else if (activeSort === "rating") {
        sorted.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
    } else if (activeSort === "title") {
        sorted.sort((a, b) => a.dataset.title.localeCompare(b.dataset.title));
    }

    sorted.forEach((el) => timeline.insertBefore(el, emptyState));

}


// ---------- SHARED PANEL HELPERS ----------

function togglePanel(panel, trigger) {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    trigger.setAttribute("aria-expanded", String(!isOpen));
}

function closePanel(panel, trigger) {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    if (trigger) trigger.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", (event) => {

    if (filterWrapper && !filterWrapper.contains(event.target)) {
        closePanel(filterPanel, filterBtn);
    }

    if (sortWrapper && !sortWrapper.contains(event.target)) {
        closePanel(sortPanel, sortBtn);
    }

});


// ---------- APPLY FILTERS ----------

function applyDiaryFilters() {

    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    let visibleCount = 0;

    diaryEntries.forEach((entry) => {

        const matchesYear = activeYear === "all" || entry.dataset.year === thisYear;
        const matchesType = activeType === "all" || entry.dataset.type === activeType;

        const entryGenres = (entry.dataset.genres || "").split(" ");
        const matchesGenre =
            selectedGenres.size === 0 ||
            entryGenres.some((genre) => selectedGenres.has(genre));

        const matchesCountry =
            selectedCountries.size === 0 ||
            selectedCountries.has(entry.dataset.country);

        const matchesSearch = query === "" || entry.dataset.search.includes(query);

        const isVisible = matchesYear && matchesType && matchesGenre && matchesCountry && matchesSearch;

        entry.style.display = isVisible ? "" : "none";

        if (isVisible) {
            visibleCount++;
        }

    });

    const monthTitles = document.querySelectorAll(".month-title");

    monthTitles.forEach((month) => {

        if (activeSort !== "newest") {
            // Selain "Newest first", entry ditampilkan sebagai daftar rata (tanpa judul bulan)
            month.style.display = "none";
            return;
        }

        let sibling = month.nextElementSibling;
        let hasVisibleEntry = false;

        while (sibling && !sibling.classList.contains("month-title")) {

            if (
                sibling.classList.contains("diary-entry") &&
                sibling.style.display !== "none"
            ) {
                hasVisibleEntry = true;
                break;
            }

            sibling = sibling.nextElementSibling;

        }

        month.style.display = hasVisibleEntry ? "" : "none";

    });

    if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
    }

}
