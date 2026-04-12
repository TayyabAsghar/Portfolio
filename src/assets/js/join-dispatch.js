function setupDispatchForm() {
  const input = document.getElementById("dispatch-email-input");
  const submitBtn = document.getElementById("dispatch-submit-btn");

  if (input && submitBtn) {
    const checkInput = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(input.value.trim()))
        submitBtn.removeAttribute("disabled");
      else submitBtn.setAttribute("disabled", "true");
    };

    input.addEventListener("input", checkInput);
    checkInput();
  }
}

// Initialize on script load
setupDispatchForm();

// Re-initialize if Astro View Transitions are used
document.addEventListener("astro:page-load", setupDispatchForm);
