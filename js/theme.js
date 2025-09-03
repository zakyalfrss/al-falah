const toggleCheckbox = document.getElementById("toggle-theme");
const themeIcon = document.getElementById("theme-icon");

// cek preferensi user
let savedTheme = localStorage.getItem("theme") || "light";
document.body.setAttribute("data-theme", savedTheme);

// posisi awal
toggleCheckbox.checked = savedTheme === "dark";
themeIcon.src =
  savedTheme === "dark" ? "/img/icon/moon.png" : "/img/icon/sun.png";

// toggle tema
toggleCheckbox.addEventListener("change", () => {
  let newTheme = toggleCheckbox.checked ? "dark" : "light";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Fade cross icon (tanpa tembus bg)
  themeIcon.style.opacity = 0;
  setTimeout(() => {
    themeIcon.src =
      newTheme === "dark" ? "/img/icon/moon.png" : "/img/icon/sun.png";
    themeIcon.style.opacity = 1;
  }, 250);
});
