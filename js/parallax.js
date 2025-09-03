// parallax.js - Plug & Play pakai data-speed + data-speed-x
const parallaxContainer = document.getElementById("img-parallax");

fetch("/parallax/parallax.html")
  .then((res) => res.text())
  .then((html) => {
    parallaxContainer.innerHTML = html;
    initParallax();
    updateParallax();
  })
  .catch((err) => console.error("Gagal load parallax:", err));

let latestScrollY = 0;
let ticking = false;

function onScroll() {
  latestScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}

function updateParallax() {
  const y = latestScrollY;
  document.querySelectorAll("[data-speed]").forEach((el) => {
    if (el.classList.contains("static")) return; // ❌ skip kalau static

    const speedY = parseFloat(el.getAttribute("data-speed")) || 0;
    const speedX = parseFloat(el.getAttribute("data-speed-x")) || 0;

    el.style.transform = `translate3d(${y * speedX}px, ${y * speedY}px, 0)`;
  });
  ticking = false;
}

function initParallax() {
  window.addEventListener("scroll", onScroll, { passive: true });
}
