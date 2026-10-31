// ==========================================
// INTERAKSI HALAMAN SOCIAL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Logika Tab Navigasi Sosial (Following / Global)
    const tabButtons = document.querySelectorAll('.social-tab-btn');
    const activityCards = document.querySelectorAll('.activity-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabType = btn.getAttribute('data-tab');

            activityCards.forEach(card => {
                const feedType = card.getAttribute('data-feed');
                if (tabType === 'global' || feedType === tabType) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // 2. Logika Interaktif Tombol Like pada Feed
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

    // 3. Logika Tombol Follow di Sidebar (Who to Follow)
    const followButtons = document.querySelectorAll('.widget-follow-btn');

    followButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('followed')) {
                btn.classList.remove('followed');
                btn.textContent = 'Follow';
            } else {
                btn.classList.add('followed');
                btn.textContent = 'Following';
            }
        });
    });
});