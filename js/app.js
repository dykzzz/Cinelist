// ===========================
// MOVIE JOURNAL APP
// ===========================

// Key Local Storage
const STORAGE_KEY = "dataFilm";

// Ambil data dari Local Storage
let daftarFilm = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ===========================
// SIMPAN DATA
// ===========================

function simpanData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarFilm));
}

// ===========================
// TAMBAH FILM
// ===========================

function tambahFilm(film) {
    daftarFilm.push(film);
    simpanData();
    updateUI();
}

// ===========================
// UPDATE UI
// ===========================

function updateUI() {
    updateStatistik();
    updateFilmTahunIni();
    tampilkanReviewTerbaru();
}

// ===========================
// STATISTIK
// ===========================

function updateStatistik() {
    const total = daftarFilm.length;
    const totalWatchedEl = document.getElementById("total-watched");
    if (totalWatchedEl) {
        totalWatchedEl.textContent = total + " Film";
    }
}

// ===========================
// SPOTLIGHT TRENDING CAROUSEL
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('featTrack');
    const cards = document.querySelectorAll('.spotlight-card');
    const peekHint = document.getElementById('peekHint');
    const verticalTitle = document.getElementById('verticalTitle');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const wrapper = document.getElementById('featWrapper');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    let autoplayTimer = null;

    const movieTitles = [
        "The Odyssey",
        "Spider-Man: Brand New Day",
        "Obsession"
    ];

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        cards.forEach((card, idx) => {
            if (idx === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        const nextIndex = (currentIndex + 1) % totalCards;
        if (verticalTitle) {
            verticalTitle.textContent = movieTitles[nextIndex];
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    if (peekHint) {
        peekHint.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, 30000);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    if (wrapper) {
        wrapper.addEventListener('mouseenter', stopAutoplay);
        wrapper.addEventListener('mouseleave', startAutoplay);
    }

    updateCarousel();
    startAutoplay();
});

// ===========================
// WHAT'S POPULAR (FILTER & MARQUEE)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    const popFilterButtons = document.querySelectorAll('.pop-tab-btn');
    const movieCards = document.querySelectorAll('.movie-card');

    popFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            popFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            movieCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    const titleElements = document.querySelectorAll('.movie-title');
    titleElements.forEach(titleEl => {
        const container = titleEl.parentElement;
        if (titleEl.scrollWidth > container.clientWidth) {
            titleEl.classList.add('is-marquee');
        }
    });
});

// ===========================
// RECENT ACTIVITY (FILTER & LIKE)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    // PERBAIKAN UTAMA: Menggunakan class .act-tab-btn agar tidak bentrok
    const actFilterButtons = document.querySelectorAll('.act-tab-btn');
    const activityCards = document.querySelectorAll('.activity-card');

    actFilterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            actFilterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterType = btn.getAttribute('data-filter');

            activityCards.forEach(card => {
                const feedCategory = card.getAttribute('data-feed');
                
                if (filterType === 'global' || feedCategory === filterType) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            const countSpan = button.querySelector('.like-count');
            let currentCount = parseInt(countSpan.textContent);

            if (button.classList.contains('liked')) {
                button.classList.remove('liked');
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                countSpan.textContent = currentCount - 1;
            } else {
                button.classList.add('liked');
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                countSpan.textContent = currentCount + 1;
            }
        });
    });
});

// ===========================
// FILM TAHUN INI
// ===========================

function updateFilmTahunIni() {
    const tahun = new Date().getFullYear();
    const watchedThisYearEl = document.getElementById("watched-this-year");
    
    if (watchedThisYearEl) {
        const jumlah = daftarFilm.filter(film =>
            film.tanggal && film.tanggal.startsWith(tahun)
        ).length;
        watchedThisYearEl.textContent = jumlah + " Film";
    }
}

// ===========================
// REVIEW TERBARU
// ===========================

function tampilkanReviewTerbaru() {
    const review = document.getElementById("latest-review");
    if (!review) return;

    if (daftarFilm.length === 0) {
        review.innerHTML = "<p>Belum ada film yang ditambahkan.</p>";
        return;
    }

    const film = daftarFilm[daftarFilm.length - 1];

    review.innerHTML = `
        <h3>${film.judul}</h3>
        <p>${film.genre}</p>
        <p>⭐ ${film.rating}/10</p>
        <p>${film.review}</p>
        <small>${film.tanggal}</small>
    `;
}

// ===========================
// FORM
// ===========================

const form = document.getElementById("movie-form");
if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const filmBaru = {
            judul: document.getElementById("judul").value,
            tanggal: document.getElementById("tanggal").value,
            genre: document.getElementById("genre").value,
            rating: Number(document.getElementById("rating").value),
            review: document.getElementById("review").value
        };

        tambahFilm(filmBaru);
        form.reset();
        alert("Film berhasil ditambahkan!");
    });
}

// ===========================
// TMDB TRENDING MOVIES
// ===========================

const apiKey = 'MASUKKAN_API_KEY_DISINI';
const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=id-ID`;

async function loadTrendingMovies() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results.slice(0, 4);

        const gridContainer = document.querySelector('.movie-grid-home');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        movies.forEach(movie => {
            const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            const card = `
                <div class="movie-card-home">
                    <img src="${posterUrl}" alt="${movie.title}" class="movie-poster-home">
                    <div class="movie-info-home">
                        <h4>${movie.title}</h4>
                        <p class="movie-genre-home">Rating: ⭐ ${movie.vote_average.toFixed(1)}</p>
                        <span class="movie-badge">Trending</span>
                    </div>
                </div>
            `;
            gridContainer.innerHTML += card;
        });
    } catch (error) {
        console.error('Gagal memuat data film:', error);
    }
}

// ===========================
// TOP REVIEWERS: INTERAKSI FOLLOW
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    const followButtons = document.querySelectorAll('.follow-btn');

    followButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('followed')) {
                button.classList.remove('followed');
                button.textContent = 'Follow';
            } else {
                button.classList.add('followed');
                button.textContent = 'Following';
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const watchedButtons = document.querySelectorAll('.mark-watched-action');

    watchedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            
            if (btn.classList.contains('watched-active')) {
                btn.classList.remove('watched-active');
                icon.classList.remove('fa-solid', 'fa-check');
                icon.classList.add('fa-regular', 'fa-eye');
                btn.innerHTML = '<i class="fa-regular fa-eye"></i> Mark as watched';
                btn.style.color = '#38bdf8';
            } else {
                btn.classList.add('watched-active');
                icon.classList.remove('fa-regular', 'fa-eye');
                icon.classList.add('fa-solid', 'fa-check');
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Watched';
                btn.style.color = '#22c55e'; // Warna hijau penanda sudah ditonton
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById('listsCarousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Kecepatan scroll geser
            slider.scrollLeft = scrollLeft - walk;
        });
    }
});

// Jalankan fungsi saat halaman dibuka jika API Key sudah diisi
// loadTrendingMovies();

// ===========================
// LOAD INITIAL UI
// ===========================

updateUI();
