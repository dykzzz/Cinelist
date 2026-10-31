/* =========================================================
   DATA — ganti bagian ini dengan data asli dari backend/API
   ========================================================= */
const DATA = {
  totals: { titles: 142, movies: 112, series: 30 },

  genres: [
    { name: "Sci-Fi", pct: 35, color: "#E8B34A" },
    { name: "Thriller", pct: 25, color: "#8C7CF0" },
    { name: "Drama", pct: 20, color: "#5B9BD5" },
    { name: "Aksi", pct: 12, color: "#E2637A" },
    { name: "Dokumenter", pct: 8, color: "#4FBF8B" },
  ],

  // rating 1..5 dari total 142 judul yang dinilai
  ratingDistribution: [3, 9, 31, 64, 35],

  // aktivitas bulanan (Jan..Des), total harus = totals.titles
  monthly: [8, 11, 18, 10, 9, 12, 14, 13, 11, 12, 9, 15],
  monthLabels: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],

  hallOfFame: {
    rewatch: {
      title: "Interstellar",
      detail: "Ditonton ulang 4 kali — film yang paling sering kamu putar lagi.",
    },
    person: {
      name: "Christopher Nolan",
      detail: "Muncul di 8 film yang kamu tonton, dengan rating rata-rata 4.7 dari kamu.",
    },
    review: {
      quote: "Ini film yang bikin kamu keluar bioskop dan langsung diam sepanjang jalan pulang.",
      film: "Oppenheimer",
      likes: 128,
    },
  },
};

/* =========================================================
   HELPERS
   ========================================================= */
function animateCount(el, target, opts = {}) {
  const { duration = 1200, decimals = 0, suffix = "" } = opts;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value = target * eased;
    el.textContent = decimals > 0 ? value.toFixed(decimals) + suffix : Math.round(value) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function ratingTemperament(distribution) {
  const total = distribution.reduce((a, b) => a + b, 0);
  const weighted = distribution.reduce((sum, count, i) => sum + count * (i + 1), 0);
  const avg = weighted / total;
  const lowShare = (distribution[0] + distribution[1]) / total;
  if (avg >= 4 && lowShare < 0.1) return "Penonton yang murah hati — jarang kasih bintang rendah";
  if (avg <= 2.8) return "Kamu penonton yang cukup pemilih";
  return "Penilaianmu cenderung seimbang";
}

/* =========================================================
   1. QUICK STATS — count-up saat halaman dimuat
   ========================================================= */
function renderQuickStats() {
  document.querySelectorAll(".stat-value[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    animateCount(el, target, { suffix });
  });
  document.querySelectorAll(".stat-value[data-decimal]").forEach((el) => {
    const target = Number(el.dataset.decimal);
    animateCount(el, target, { decimals: 1 });
  });
  document.getElementById("rating-temperament").textContent = ratingTemperament(DATA.ratingDistribution);
}

/* =========================================================
   2. GENRE DONUT + LEGEND
   ========================================================= */
function renderGenreDonut() {
  const svg = document.getElementById("genre-donut");
  const size = 200, cx = size / 2, cy = size / 2, r = 78, strokeWidth = 26;
  const circumference = 2 * Math.PI * r;

  const bgCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  bgCircle.setAttribute("cx", cx);
  bgCircle.setAttribute("cy", cy);
  bgCircle.setAttribute("r", r);
  bgCircle.setAttribute("fill", "none");
  bgCircle.setAttribute("stroke", "rgba(255,255,255,0.06)");
  bgCircle.setAttribute("stroke-width", strokeWidth);
  svg.appendChild(bgCircle);

  let offset = 0;
  DATA.genres.forEach((genre) => {
    const dash = (genre.pct / 100) * circumference;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", genre.color);
    circle.setAttribute("stroke-width", strokeWidth);
    circle.setAttribute("stroke-dasharray", `${dash} ${circumference - dash}`);
    circle.setAttribute("stroke-dashoffset", -offset);
    circle.setAttribute("transform", `rotate(-90 ${cx} ${cy})`);
    circle.style.transition = "stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)";
    circle.innerHTML = `<title>${genre.name} — ${genre.pct}%</title>`;
    svg.appendChild(circle);
    offset += dash;
  });

  document.getElementById("donut-top-genre").textContent = DATA.genres[0].name;

  const legend = document.getElementById("genre-legend");
  DATA.genres.forEach((genre) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="name"><span class="swatch" style="background:${genre.color}"></span>${genre.name}</span><b>${genre.pct}%</b>`;
    legend.appendChild(li);
  });
}

/* =========================================================
   2b. MOVIE vs SERIES RATIO BAR
   ========================================================= */
function renderRatio() {
  const { titles, movies, series } = DATA.totals;
  const moviePct = Math.round((movies / titles) * 100);
  const seriesPct = 100 - moviePct;

  document.getElementById("ratio-movie-pct").textContent = `${moviePct}%`;
  document.getElementById("ratio-series-pct").textContent = `${seriesPct}%`;

  const movieEl = document.getElementById("ratio-movie");
  const seriesEl = document.getElementById("ratio-series");
  movieEl.title = `${movies} Film`;
  seriesEl.title = `${series} Series`;

  requestAnimationFrame(() => {
    movieEl.style.width = `${moviePct}%`;
    seriesEl.style.width = `${seriesPct}%`;
  });
}

/* =========================================================
   3. RATING BAR CHART (kurva distribusi bintang)
   ========================================================= */
function renderRatingChart() {
  const svg = document.getElementById("rating-chart");
  const width = 420, height = 220;
  const chartTop = 20, chartBottom = 180, chartLeft = 40, chartRight = 400;
  const barGap = 18;
  const barWidth = (chartRight - chartLeft - barGap * 4) / 5;
  const maxVal = Math.max(...DATA.ratingDistribution);

  DATA.ratingDistribution.forEach((count, i) => {
    const barHeight = (count / maxVal) * (chartBottom - chartTop);
    const x = chartLeft + i * (barWidth + barGap);
    const y = chartBottom - barHeight;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", chartBottom);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", 0);
    rect.setAttribute("rx", 6);
    rect.setAttribute("fill", i >= 3 ? "url(#gold-grad)" : "rgba(154,163,184,0.35)");
    rect.innerHTML = `<title>${i + 1} bintang — ${count} judul</title>`;
    svg.appendChild(rect);
    requestAnimationFrame(() => {
      rect.style.transition = "y 700ms cubic-bezier(0.22,1,0.36,1), height 700ms cubic-bezier(0.22,1,0.36,1)";
      rect.setAttribute("y", y);
      rect.setAttribute("height", barHeight);
    });

    const countLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    countLabel.setAttribute("x", x + barWidth / 2);
    countLabel.setAttribute("y", y - 8);
    countLabel.setAttribute("text-anchor", "middle");
    countLabel.setAttribute("fill", "#9AA3B8");
    countLabel.setAttribute("font-size", "12");
    countLabel.setAttribute("font-family", "Inter, sans-serif");
    countLabel.textContent = count;
    svg.appendChild(countLabel);

    const starLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    starLabel.setAttribute("x", x + barWidth / 2);
    starLabel.setAttribute("y", chartBottom + 22);
    starLabel.setAttribute("text-anchor", "middle");
    starLabel.setAttribute("fill", "#F2F3F7");
    starLabel.setAttribute("font-size", "13");
    starLabel.setAttribute("font-family", "Inter, sans-serif");
    starLabel.setAttribute("font-weight", "600");
    starLabel.textContent = `${i + 1}★`;
    svg.appendChild(starLabel);
  });

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `<linearGradient id="gold-grad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#D99A2B"/>
      <stop offset="100%" stop-color="#E8B34A"/>
    </linearGradient>`;
  svg.prepend(defs);

  const total = DATA.ratingDistribution.reduce((a, b) => a + b, 0);
  const weighted = DATA.ratingDistribution.reduce((sum, count, i) => sum + count * (i + 1), 0);
  const avg = (weighted / total).toFixed(1);
  const lowShare = Math.round(((DATA.ratingDistribution[0] + DATA.ratingDistribution[1]) / total) * 100);

  document.getElementById("rating-insight").innerHTML =
    `Kamu cenderung menyukai judul-judul bagus dengan rata-rata rating <b>${avg} bintang</b>, ` +
    `dan hanya <b>${lowShare}%</b> dari seluruh tontonanmu yang kamu beri rating di bawah 3 bintang.`;
}

/* =========================================================
   4. MONTHLY TIMELINE (line chart)
   ========================================================= */
function renderTimeline() {
  const svg = document.getElementById("timeline-chart");
  const width = 640, height = 220;
  const chartTop = 20, chartBottom = 170, chartLeft = 30, chartRight = 620;
  const maxVal = Math.max(...DATA.monthly);
  const stepX = (chartRight - chartLeft) / (DATA.monthly.length - 1);

  const points = DATA.monthly.map((val, i) => {
    const x = chartLeft + i * stepX;
    const y = chartBottom - (val / maxVal) * (chartBottom - chartTop);
    return { x, y, val };
  });

  // baseline
  const baseline = document.createElementNS("http://www.w3.org/2000/svg", "line");
  baseline.setAttribute("x1", chartLeft);
  baseline.setAttribute("y1", chartBottom);
  baseline.setAttribute("x2", chartRight);
  baseline.setAttribute("y2", chartBottom);
  baseline.setAttribute("stroke", "rgba(255,255,255,0.08)");
  svg.appendChild(baseline);

  // area fill
  const areaPath = `M${points[0].x},${chartBottom} ` +
    points.map((p) => `L${p.x},${p.y}`).join(" ") +
    ` L${points[points.length - 1].x},${chartBottom} Z`;
  const area = document.createElementNS("http://www.w3.org/2000/svg", "path");
  area.setAttribute("d", areaPath);
  area.setAttribute("fill", "url(#violet-fade)");
  area.setAttribute("opacity", "0");
  svg.appendChild(area);

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `<linearGradient id="violet-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8C7CF0" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#8C7CF0" stop-opacity="0"/>
    </linearGradient>`;
  svg.prepend(defs);

  // line
  const linePath = "M" + points.map((p) => `${p.x},${p.y}`).join(" L");
  const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
  line.setAttribute("d", linePath);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", "#8C7CF0");
  line.setAttribute("stroke-width", "2.5");
  line.setAttribute("stroke-linejoin", "round");
  line.setAttribute("stroke-linecap", "round");
  const length = line.getTotalLength ? null : null;
  svg.appendChild(line);

  requestAnimationFrame(() => {
    area.style.transition = "opacity 900ms ease";
    area.setAttribute("opacity", "1");
  });

  const peakIndex = DATA.monthly.indexOf(maxVal);

  points.forEach((p, i) => {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", p.x);
    dot.setAttribute("cy", p.y);
    dot.setAttribute("r", i === peakIndex ? 6 : 3.5);
    dot.setAttribute("fill", i === peakIndex ? "#E8B34A" : "#8C7CF0");
    dot.setAttribute("stroke", "#0A0D14");
    dot.setAttribute("stroke-width", i === peakIndex ? 3 : 2);
    dot.innerHTML = `<title>${DATA.monthLabels[i]} — ${p.val} judul</title>`;
    svg.appendChild(dot);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", p.x);
    label.setAttribute("y", chartBottom + 22);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", i === peakIndex ? "#E8B34A" : "#626B80");
    label.setAttribute("font-size", "11.5");
    label.setAttribute("font-family", "Inter, sans-serif");
    label.setAttribute("font-weight", i === peakIndex ? "700" : "400");
    label.textContent = DATA.monthLabels[i];
    svg.appendChild(label);
  });

  document.getElementById("peak-callout").innerHTML =
    `Bulan <b>${DATA.monthLabels[peakIndex]}</b> adalah bulan tersibukmu dengan ${maxVal} judul ditonton.`;
}

/* =========================================================
   5. HALL OF FAME
   ========================================================= */
function renderHallOfFame() {
  const { rewatch, person, review } = DATA.hallOfFame;

  document.getElementById("rewatch-title").textContent = rewatch.title;
  document.getElementById("rewatch-detail").textContent = rewatch.detail;

  document.getElementById("person-name").textContent = person.name;
  document.getElementById("person-detail").textContent = person.detail;

  document.getElementById("review-quote").textContent = review.quote;
  document.getElementById("review-detail").textContent =
    `Ditulis untuk "${review.film}" — disukai ${review.likes} orang di komunitas.`;
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderQuickStats();
  renderGenreDonut();
  renderRatio();
  renderRatingChart();
  renderTimeline();
  renderHallOfFame();
});
