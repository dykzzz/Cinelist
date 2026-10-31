// ===========================
// SPOTLIGHT TRENDING CAROUSEL
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('spotTrack');
    const cards = document.querySelectorAll('.spotlight-slide');
    
    // Tombol Next & Preview Next
    const peekHint = document.getElementById('peekHint');
    const verticalTitle = document.getElementById('verticalTitle');
    
    // Tombol Prev & Preview Prev (BARU)
    const prevHint = document.getElementById('prevHint');
    const prevVerticalTitle = document.getElementById('prevVerticalTitle');

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const wrapper = document.getElementById('carouselWrapper');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const totalCards = cards.length;
    let autoplayTimer = null;

    // Daftar judul film sesuai urutan slide di HTML:
    // 0: The Odyssey
    // 1: Dune: Part Two
    // 2: Obsession
    const movieTitles = [
        "The Odyssey",
        "Dune: Part Two",
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

        // Hitung indeks untuk Next dan Prev
        const nextIndex = (currentIndex + 1) % totalCards;
        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;

        // Update teks judul untuk preview Next
        if (verticalTitle) {
            verticalTitle.textContent = movieTitles[nextIndex];
        }

        // Update teks judul untuk preview Prev (BARU)
        if (prevVerticalTitle) {
            prevVerticalTitle.textContent = movieTitles[prevIndex];
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

    // Event Listener untuk tombol Next
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (peekHint) {
        peekHint.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    // Event Listener untuk tombol Prev (BARU)
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    if (prevHint) {
        prevHint.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    function startAutoplay() {
        autoplayTimer = setInterval(() => {
            nextSlide();
        }, 5000);
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

// ==========================================
// LOGIKA INTERAKSI HALAMAN LIST
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Logika Tab Navigasi List
    const tabButtons = document.querySelectorAll('.list-tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Ambil atribut data-tab untuk penanganan filter list jika diperlukan ke depannya
            const selectedTab = btn.getAttribute('data-tab');
            console.log(`Tab aktif diubah ke: ${selectedTab}`);
        });
    });

    // 2. Logika Tombol Like Interaktif pada Kartu List
    const likeButtons = document.querySelectorAll('.lux-like-action');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('i');
            // Ambil teks angka dari dalam tombol (misal: "1.4K" diubah dulu atau langsung dimanipulasi)
            let textSpan = button.lastChild; 
            
            // Contoh sederhana efek toggle like
            if (button.classList.contains('liked')) {
                button.classList.remove('liked');
                button.style.color = '#f87171';
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-solid'); // Tetap hati tapi bisa disesuaikan
            } else {
                button.classList.add('liked');
                button.style.color = '#ef4444';
                // Animasi kecil saat di-like
                button.style.transform = 'scale(1.1)';
                setTimeout(() => { button.style.transform = 'scale(1)'; }, 200);
            }
        });
    });
});