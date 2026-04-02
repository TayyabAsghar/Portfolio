const button = document.getElementById("certificate-view");
const gridTrack = document.getElementById("cert-track-grid");
const marqueeTrack = document.getElementById("cert-track-marquee");

let expanded = false;

button?.addEventListener("click", () => {
  expanded = !expanded;

  if (!button) return;

  button.textContent = expanded ? "Hide" : "View all";

  gridTrack?.classList.toggle("hidden", !expanded);
  marqueeTrack?.classList.toggle("hidden", expanded);
});
