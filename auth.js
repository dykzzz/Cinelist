// ===========================
// AUTH.JS
// Logic status login (guest vs user) yang dipakai bersama
// di semua halaman: index.html, film.html, list.html, series.html
// ===========================

// ---------------------------
// CEK STATUS LOGIN & TOGGLE NAVBAR
// ---------------------------
// Elemen yang dicari (satu per halaman):
//   id="loggedMenu" -> nav-right (Rate Film + Avatar Profil), muncul kalau LOGIN
//   id="guestMenu"  -> banner-buttons (Login + Sign Up), muncul kalau GUEST
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const loggedMenu = document.getElementById('loggedMenu');
    const guestMenu = document.getElementById('guestMenu');
    const navbar = document.querySelector('.navbar');
    const loggedHero = document.getElementById('loggedHero');
    const guestHero = document.getElementById('guestHero');
    const profileUsername = document.getElementById('profileUsername');

    if (isLoggedIn) {
        if (loggedMenu) loggedMenu.style.display = 'flex';
        if (guestMenu) guestMenu.style.display = 'none';
        if (navbar) navbar.classList.remove('guest-nav');
        if (loggedHero) loggedHero.style.display = 'block';
        if (guestHero) guestHero.style.display = 'none';
        if (profileUsername) profileUsername.textContent = localStorage.getItem('username') || 'User';
    } else {
        // nav-right beneran collapse (display:none) kayak semula
        if (loggedMenu) loggedMenu.style.display = 'none';
        if (guestMenu) guestMenu.style.display = 'flex';
        // class ini yang bikin nav-left + nav-center di-redistribusi/center bareng
        if (navbar) navbar.classList.add('guest-nav');
        if (loggedHero) loggedHero.style.display = 'none';
        if (guestHero) guestHero.style.display = 'block';
    }
}

function handleLogin(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('loginUsername');
    const username = usernameInput ? usernameInput.value : 'User';

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);

    checkAuthStatus();
    closeModal('loginModal'); // sesuaikan kalau nama fungsi/id modal beda
}



// ---------------------------
// TOGGLE DROPDOWN PROFIL
// ---------------------------
// Dipanggil lewat onclick="toggleDropdown()" di avatar (.profile-avatar)
function toggleDropdown() {
    const container = document.getElementById('profileContainer');
    if (!container) return;
    container.classList.toggle('active');
}

// Tutup dropdown kalau klik di luar area profil
document.addEventListener('click', (e) => {
    const container = document.getElementById('profileContainer');
    if (!container) return;

    if (!container.contains(e.target)) {
        container.classList.remove('active');
    }
});

// ---------------------------
// LOGIN / REGISTER (dipanggil dari form modal, kalau sudah dibuat)
// ---------------------------
function loginSuccess() {
    localStorage.setItem('isLoggedIn', 'true');
    checkAuthStatus();
}

// ---------------------------
// LOGOUT
// ---------------------------
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

// ---------------------------
// JALANKAN SAAT HALAMAN DIMUAT
// ---------------------------
document.addEventListener('DOMContentLoaded', checkAuthStatus);