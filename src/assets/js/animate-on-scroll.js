const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: "0px",
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target.classList.contains("reveal-up"))
        entry.target.classList.add("animate-fade-in-up");
      else if (entry.target.classList.contains("reveal-left"))
        entry.target.classList.add("animate-fade-in-left");
      else if (entry.target.classList.contains("reveal-right"))
        entry.target.classList.add("animate-fade-in-right");

      entry.target.classList.remove("opacity-0");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right",
  );

  elements.forEach((el) => observer.observe(el));
});
