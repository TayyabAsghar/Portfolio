const initShipScroller = () => {
  const shipEl = document.getElementById("odyssey-ship");
  const timelineEl = document.getElementById("odyssey-timeline");

  if (!timelineEl || !shipEl) return;

  const ship = shipEl;
  const timeline = timelineEl;

  let rafId = null;
  let targetY = 0;
  let currentY = 0;

  const lerp = (a, b, t) => {
    return a + (b - a) * t;
  };

  const update = () => {
    const timelineRect = timeline.getBoundingClientRect();
    const shipHeight = ship.offsetHeight;
    const totalScrollable = timelineRect.height - shipHeight;

    const viewportH = window.innerHeight;
    const rawProgress =
      (-timelineRect.top + viewportH * 0.4) / timelineRect.height;
    const progress = Math.max(0, Math.min(1, rawProgress));

    targetY = progress * totalScrollable;
    const diff = targetY - currentY;
    currentY = lerp(currentY, targetY, 0.05);

    if (Math.abs(diff) > 0.5) {
      const targetRotation = diff > 0 ? 0 : 180;
      ship.style.setProperty("--ship-rotation", `${targetRotation}deg`);
    }

    ship.style.transform = `translateX(-50%) translateY(${currentY}px)`;

    // Highlight passed logos
    const shipRect = ship.getBoundingClientRect();
    const shipCenterY = shipRect.top + shipRect.height / 2;
    const logos = document.querySelectorAll(".company-logo-container");

    logos.forEach((logo) => {
      const logoRect = logo.getBoundingClientRect();
      const logoCenterY = logoRect.top + logoRect.height / 2;

      if (shipCenterY >= logoCenterY - 20) logo.classList.add("passed-logo");
      else logo.classList.remove("passed-logo");
    });

    rafId = requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(update);
        } else {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        }
      });
    },
    { rootMargin: "400px" },
  );

  observer.observe(timeline);
};

if (typeof document !== "undefined")
  document.addEventListener("astro:page-load", initShipScroller);
