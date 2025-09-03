// ==== ANIMASI SHOW SAAT SCROLL ====
function revealOnScroll() {
  const items = document.querySelectorAll(".animasi");
  const triggerBottom = window.innerHeight * 0.85;
  const triggerTop = window.innerHeight * 0.15;

  items.forEach((item) => {
    const boxTop = item.getBoundingClientRect().top;
    const boxBottom = item.getBoundingClientRect().bottom;

    if (boxTop < triggerBottom && boxBottom > triggerTop) {
      item.classList.add("show");

      // Jalankan animasi angka jika ada elemen .counter
      if (item.querySelector(".counter") && !angkaSudahJalan) {
        animateAngkaOnce();
      }
    } else {
      item.classList.remove("show");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// ==== ANIMASI ANGKA BERJALAN SEKALI ====
let angkaSudahJalan = false;

function animateAngkaOnce() {
  if (angkaSudahJalan) return;

  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 2000; // 2 detik

    let start = null;

    function update(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;

      const easeOut = (t) => 1 - Math.pow(1 - t, 3); // easing smooth

      const percent = Math.min(progress / duration, 1);
      const eased = easeOut(percent);

      const value = Math.floor(eased * target);
      counter.textContent = value;

      if (percent < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target;
      }
    }

    requestAnimationFrame(update);
  });

  angkaSudahJalan = true;
}
