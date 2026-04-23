const flipRow = (row, duration) => {
  const image = row.querySelector("[data-project-image]");
  const text = row.querySelector("[data-project-text]");
  if (!image || !text) return;

  const imageFirst = image.getBoundingClientRect();
  const textFirst = text.getBoundingClientRect();

  const current = row.getAttribute("data-direction");
  const next = current === "row" ? "row-reverse" : "row";
  row.setAttribute("data-direction", next);

  if (next === "row") {
    row.classList.remove("md:flex-row-reverse");
    row.classList.add("md:flex-row");
  } else {
    row.classList.remove("md:flex-row");
    row.classList.add("md:flex-row-reverse");
  }

  const imageLast = image.getBoundingClientRect();
  const textLast = text.getBoundingClientRect();

  const imageDeltaX = imageFirst.left - imageLast.left;
  const textDeltaX = textFirst.left - textLast.left;

  image.style.transition = "none";
  text.style.transition = "none";
  image.style.transform = `translateX(${imageDeltaX}px)`;
  text.style.transform = `translateX(${textDeltaX}px)`;

  image.getBoundingClientRect();

  const easing = "cubic-bezier(0.16, 1, 0.3, 1)";
  image.style.transition = `transform ${duration}ms ${easing}`;
  text.style.transition = `transform ${duration}ms ${easing}`;
  image.style.transform = "";
  text.style.transform = "";
};

const scheduleFlip = (row, duration, interval) => {
  flipRow(row, duration);
  setTimeout(() => scheduleFlip(row, duration, interval), duration + interval);
};

const setupFlipLoop = () => {
  const rows = document.querySelectorAll("[data-project-row='true']");

  rows.forEach((row, i) => {
    const config = row.closest("[data-flip-duration]") ?? row;
    const duration = parseInt(
      config.getAttribute("data-flip-duration") ?? "850",
      10,
    );
    const interval = parseInt(
      config.getAttribute("data-flip-interval") ?? "4000",
      10,
    );

    setTimeout(() => scheduleFlip(row, duration, interval), i * 800);
  });
};

setupFlipLoop();

document.addEventListener("astro:page-load", setupFlipLoop);
