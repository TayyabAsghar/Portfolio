const initCertificateView = () => {
  const button = document.getElementById("certificate-view");
  const viewText = document.getElementById("cert-view-text");
  const gridTrack = document.getElementById("cert-track-grid");
  const marqueeTrack = document.getElementById("cert-track-marquee");
  if (!button) return;

  const eyeIcon = button.querySelector(".icon-eye");
  const eyeOffIcon = button.querySelector(".icon-eye-off");

  let expanded = false;

  button.addEventListener("click", () => {
    expanded = !expanded;

    viewText.textContent = expanded ? "Hide" : "View all";
    eyeIcon?.classList.toggle("hidden", expanded);
    eyeOffIcon?.classList.toggle("hidden", !expanded);

    gridTrack?.classList.toggle("hidden", !expanded);
    marqueeTrack?.classList.toggle("hidden", expanded);
  });
};

initCertificateView();
document.addEventListener("astro:page-load", initCertificateView);

