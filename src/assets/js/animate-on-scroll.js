const setupScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;

        const reveals = target.querySelectorAll(".reveal:not(.active)");
        if (reveals.length > 0) {
          reveals.forEach((el, index) => {
            setTimeout(() => {
              el.classList.add("active");
            }, index * 100);
          });
        }

        if (target.classList.contains("reveal-up"))
          target.classList.add("animate-fade-in-up");
        else if (target.classList.contains("reveal-left"))
          target.classList.add("animate-fade-in-left");
        else if (target.classList.contains("reveal-right"))
          target.classList.add("animate-fade-in-right");
        else if (target.classList.contains("reveal"))
          target.classList.add("active");

        target.classList.remove("opacity-0");

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  const scrollTargets = document.querySelectorAll(
    ".animate-on-scroll, .reveal-up, .reveal-left, .reveal-right, .reveal:not(.animate-on-scroll *)",
  );

  scrollTargets.forEach((el) => observer.observe(el));
};

setupScrollAnimations();

document.addEventListener("astro:page-load", setupScrollAnimations);
