window.darkMode = true;

const stickyClasses = ["fixed", "h-14"];
const unstickyClasses = ["absolute", "h-20"];
const stickyClassesContainer = [
  "border-neutral-300/50",
  "bg-white/80",
  "dark:border-neutral-600/40",
  "dark:bg-neutral-900/60",
  "backdrop-blur-2xl",
];
const unstickyClassesContainer = ["border-transparent"];
let headerElement = null;

document.addEventListener("astro:page-load", () => {
  headerElement = document.getElementById("header");

  const isDarkMode =
    localStorage.getItem("dark_mode") &&
    localStorage.getItem("dark_mode") === "true";

  if (isDarkMode) {
    window.darkMode = true;
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  stickyHeaderFunctionality();
  applyMenuItemClasses();
  evaluateHeaderPosition();
  mobileMenuFunctionality();
  initDarkToggle();
});

// window.toggleDarkMode = function(){
//     document.documentElement.classList.toggle('dark');
//     if(document.documentElement.classList.contains('dark')){
//         localStorage.setItem('dark_mode', true);
//         window.darkMode = true;
//     } else {
//         window.darkMode = false;
//         localStorage.setItem('dark_mode', false);
//     }
// }

let isScrollListenerAdded = false;
window.stickyHeaderFunctionality = () => {
  if (!isScrollListenerAdded) {
    window.addEventListener("scroll", () => {
      evaluateHeaderPosition();
    });
    isScrollListenerAdded = true;
  }
};

window.evaluateHeaderPosition = () => {
  if (window.scrollY > 16) {
    headerElement.firstElementChild.classList.add(...stickyClassesContainer);
    headerElement.firstElementChild.classList.remove(
      ...unstickyClassesContainer,
    );
    headerElement.classList.add(...stickyClasses);
    headerElement.classList.remove(...unstickyClasses);
    document.getElementById("menu").classList.add("top-[56px]");
    document.getElementById("menu").classList.remove("top-[75px]");
  } else {
    headerElement.firstElementChild.classList.remove(...stickyClassesContainer);
    headerElement.firstElementChild.classList.add(...unstickyClassesContainer);
    headerElement.classList.add(...unstickyClasses);
    headerElement.classList.remove(...stickyClasses);
    document.getElementById("menu").classList.remove("top-[56px]");
    document.getElementById("menu").classList.add("top-[75px]");
  }
};

const initDarkToggle = () => {
  const toggle = document.getElementById("darkToggle");
  if (!toggle) return;

  // Clone to remove existing listeners (prevent duplicates on page-load)
  const newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);

  newToggle.addEventListener("click", () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.removeItem("dark_mode");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark_mode", true);
    }
  });
};

window.applyMenuItemClasses = () => {
  const menuItems = document.querySelectorAll("#menu a");
  for (let i = 0; i < menuItems.length; i++) {
    if (menuItems[i].pathname === window.location.pathname)
      menuItems[i].classList.add("text-neutral-900", "dark:text-white");
  }
  //:class="{ 'text-neutral-900 dark:text-white': window.location.pathname == '{menu.url}', 'text-neutral-700 dark:text-neutral-400': window.location.pathname != '{menu.url}' }"
};

const mobileMenuFunctionality = () => {
  document.getElementById("openMenu").addEventListener("click", () => {
    openMobileMenu();
  });

  document.getElementById("closeMenu").addEventListener("click", () => {
    closeMobileMenu();
  });
};

window.openMobileMenu = () => {
  document.getElementById("openMenu").classList.add("hidden");
  document.getElementById("closeMenu").classList.remove("hidden");
  document.getElementById("menu").classList.remove("hidden");
  document.getElementById("mobileMenuBackground").classList.add("opacity-0");
  document.getElementById("mobileMenuBackground").classList.remove("hidden");

  setTimeout(() => {
    document
      .getElementById("mobileMenuBackground")
      .classList.remove("opacity-0");
  }, 1);
};

window.closeMobileMenu = () => {
  document.getElementById("closeMenu").classList.add("hidden");
  document.getElementById("openMenu").classList.remove("hidden");
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("mobileMenuBackground").classList.add("hidden");
};

window.showAllCertificates = () => {
  document.getElementById("certificates").style.height = "auto";
  document.getElementById("certificatesButton").classList.add("!hidden");
};
