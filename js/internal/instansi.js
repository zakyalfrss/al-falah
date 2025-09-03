gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const sections = document.querySelectorAll("section");
let currentIndex = 0;
let autoScrollTimer;
const AUTO_SCROLL_DELAY = 7000; // ms per section

sections.forEach((sec, index) => {
  const bg = sec.querySelector(".bg-1");
  const tengah = sec.querySelector(".gambar-tengah-1 img");
  const bawah = sec.querySelector(".gambar-bawah-1 img");
  const teks = sec.querySelector(".main-text-1");

  // initial state (safe)
  gsap.set(bg, { scale: 1, transformOrigin: "center center" });
  gsap.set([tengah, bawah, teks], { opacity: 0, y: 60 }); // hidden by default

  // intro timeline (played each time section is entered)
  const intro = gsap.timeline({ paused: true });
  intro
    .to(bg, { scale: 1.1, duration: 2.5, ease: "power2.out" }) // animasi bg
    .to(
      tengah,
      { y: 0, opacity: 1, duration: 1.8, ease: "power1.out" },
      "-=1.5"
    ) // animasi tengah
    .to(bawah, { y: 0, opacity: 1, duration: 1.6, ease: "power1.out" }, "-=1.2") // animasi bawah
    .to(teks, { y: 0, opacity: 1, duration: 1.4, ease: "power2.out" }, "-=1"); // animasi teks

  // looping tweens (paused by default — only play when section active)
  const loopBg = gsap.to(bg, {
    scale: 2, // Ukuran bg diubah sedikit
    duration: 10, // Durasi animasi looping
    ease: "sine.inOut", // Efek easing animasi
    repeat: -1, // Mengulang terus-menerus
    yoyo: true, // Membalikkan animasi setelah selesai
    paused: true, // Animasi ini dimulai setelah intro selesai
  });

  const loopTengah = gsap.to(tengah, {
    scale: 1.8, // Ukuran bg diubah sedikit
    y: "+=20",
    duration: 15,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    paused: true,
  });
  const loopBawah = gsap.to(bawah, {
    scale: 1.2, // Ukuran bg diubah sedikit
    y: "-=30",
    duration: 10,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    paused: true,
  });
  const loopTeks = gsap.to(teks, {
    scale: 1.2,
    y: "+=40",
    duration: 13,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    paused: true,
  });

  // ScrollTrigger: kontrol play/pause intro & loops
  ScrollTrigger.create({
    trigger: sec,
    start: "top center",
    end: "bottom center",
    onEnter: () => {
      // pastikan non-bg hidden sebelum intro start (menghindari flash)
      gsap.set([tengah, bawah, teks], { opacity: 0, y: 60 });
      gsap.set(bg, { scale: 1.15 });
      intro.restart(); // main cinematic intro
      // start looping AFTER intro finishes (to prevent overlap freeze)
      intro.eventCallback("onComplete", () => {
        loopBg.play(0);
        loopTengah.play(0);
        loopBawah.play(0);
        loopTeks.play(0);
      });
      resetAutoScroll();
    },
    onEnterBack: () => {
      // user scroll kembali ke atas
      gsap.set([tengah, bawah, teks], { opacity: 0, y: 60 });
      gsap.set(bg, { scale: 1.15 });
      intro.restart();
      intro.eventCallback("onComplete", () => {
        loopBg.play(0);
        loopTengah.play(0);
        loopBawah.play(0);
        loopTeks.play(0);
      });
      resetAutoScroll();
    },
    onLeave: () => {
      // stop looping for this section and hide non-bg quickly
      loopBg.pause();
      loopTengah.pause();
      loopBawah.pause();
      loopTeks.pause();
      intro.pause(0);
      gsap.set([tengah, bawah, teks], { opacity: 0, y: 60 }); // hide layers instantly
      gsap.set(bg, { scale: 1.15 }); // reset bg scale for next entry
    },
    onLeaveBack: () => {
      loopBg.pause();
      loopTengah.pause();
      loopBawah.pause();
      loopTeks.pause();
      intro.pause(0);
      gsap.set([tengah, bawah, teks], { opacity: 0, y: 60 });
      gsap.set(bg, { scale: 1.15 });
    },
    markers: false,
  });

  // start the first section's animation immediately on load
  if (index === 0) {
    // small timeout to allow layout/paint then animate
    setTimeout(() => {
      intro.restart();
      intro.eventCallback(
        "onComplete",
        () =>
          loopBg.play(0) &&
          loopTengah.play(0) &&
          loopBawah.play(0) &&
          loopTeks.play(0)
      );
    }, 80);
  }
});

/* ---------- auto scroll logic (optional) ---------- */
// Menggunakan GSAP untuk auto-scroll ke section berikutnya
function goToSection(index) {
  if (index >= sections.length) index = 0; // Jika sudah mencapai akhir, kembali ke awal
  const sec = sections[index];
  currentIndex = index;
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: sec, autoKill: true }, // Scroll otomatis ke bagian tersebut
    ease: "power2.inOut", // Ease untuk scroll
    onComplete: resetAutoScroll, // Reset auto-scroll setelah mencapai section
  });
}

function resetAutoScroll() {
  clearTimeout(autoScrollTimer);
  autoScrollTimer = setTimeout(() => {
    goToSection(currentIndex + 1);
  }, AUTO_SCROLL_DELAY);
}

// menu buttons (if ada)
document.querySelectorAll(".menu button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = parseInt(btn.dataset.target, 10);
    if (!isNaN(idx)) {
      goToSection(idx);
    }
  });
});

// start auto-scroll
resetAutoScroll();
