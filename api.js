// js/api.js

// Masukkan API key OMDb yang sudah kamu dapatkan di sini
const API_KEY = "af7721c4"
const BASE_URL = "https://www.omdbapi.com/";

/**
 * Fungsi untuk mencari film berdasarkan judul
 * @param {string} query - Judul film yang dicari
 * @returns {Promise<Object>} - Mengembalikan data film dalam bentuk JSON
 */
async function searchMovies(query) {
    try {
        const response = await fetch(`${BASE_URL}?s=${encodeURIComponent(query)}&apikey=${API_KEY}`);
        const data = await response.json();
        return data; // Biasanya berupa daftar film (Search: [...])
    } catch (error) {
        console.error("Gagal mengambil data pencarian:", error);
        return { Response: "False", Error: "Terjadi kesalahan jaringan" };
    }
}

/**
 * Fungsi untuk mengambil detail lengkap satu film berdasarkan ID (IMDb ID)
 * @param {string} id - IMDb ID film (contoh: tt0111161)
 * @returns {Promise<Object>} - Mengembalikan detail lengkap film
 */
async function getMovieDetails(id) {
    try {
        const response = await fetch(`${BASE_URL}?i=${id}&apikey=${API_KEY}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Gagal mengambil detail film:", error);
        return { Response: "False", Error: "Terjadi kesalahan jaringan" };
    }
}