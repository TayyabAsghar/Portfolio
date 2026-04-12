export function setupContactForm() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit-btn");

  if (form && submitBtn) {
    const inputs = form.querySelectorAll("input, textarea");

    const checkInputs = () => {
      let isValid = true;
      inputs.forEach((input) => {
        if (!String(input.value).trim()) {
          isValid = false;
        }
      });

      if (isValid) {
        submitBtn.removeAttribute("disabled");
      } else {
        submitBtn.setAttribute("disabled", "true");
      }
    };

    form.addEventListener("input", checkInputs);
    checkInputs();

    form.onsubmit = (e) => {
      e.preventDefault();
      const targetEmail = form.getAttribute("data-email");
      const formData = new FormData(form);
      const name = formData.get("name") || "Someone";
      const email = formData.get("email") || "No email provided";
      const message = formData.get("message") || "No message provided";

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      );

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${body}`;
      window.open(gmailUrl, "_blank");
    };
  }
}

// Initialize on first script load
setupContactForm();

// Re-initialize if Astro View Transitions are used
document.addEventListener("astro:page-load", setupContactForm);
