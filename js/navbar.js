// load navbar.html
fetch("/user/navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;

    // init fitur navbar
    initThemeToggle();
    initHamburgerMenu();
    setActiveNavLink(); // Menambahkan kelas aktif pada link yang sesuai
  });

// === THEME TOGGLE ===
function initThemeToggle() {
  const toggleCheckbox = document.getElementById("toggle-theme");
  const themeIcon = document.getElementById("theme-icon");

  let savedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", savedTheme);

  toggleCheckbox.checked = savedTheme === "dark";
  themeIcon.src =
    savedTheme === "dark" ? "/img/icon/moon.png" : "/img/icon/sun.png";

  toggleCheckbox.addEventListener("change", () => {
    let newTheme = toggleCheckbox.checked ? "dark" : "light";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    themeIcon.style.opacity = 0;
    setTimeout(() => {
      themeIcon.src =
        newTheme === "dark" ? "/img/icon/moon.png" : "/img/icon/sun.png";
      themeIcon.style.opacity = 1;
    }, 200);

    document.dispatchEvent(
      new CustomEvent("themeChange", { detail: { theme: newTheme } })
    );
  });
}

// === HAMBURGER MENU ===
function initHamburgerMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.querySelector(".navbar");

  if (!menuToggle || !navbar) return;

  menuToggle.addEventListener("click", () => {
    navbar.classList.toggle("open");
  });

  // auto close kalau klik link
  document.querySelectorAll(".nav-l a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("open");
    });
  });
}

// === Menambahkan Kelas Aktif pada Link Navbar ===
function setActiveNavLink() {
  const navLinks = document.querySelectorAll(".nav-l a");
  const currentPage = window.location.pathname;

  navLinks.forEach((link) => {
    // Mendapatkan URL dari href link
    const linkPage = link.getAttribute("href");

    // Jika link URL sesuai dengan URL halaman saat ini, tambahkan kelas active
    if (currentPage.includes(linkPage)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
// menu buttons (optional)
document.querySelectorAll(".menu button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const idx = parseInt(btn.dataset.target, 10);
    if (!isNaN(idx)) {
      goToSection(idx);
    }
  });
});
