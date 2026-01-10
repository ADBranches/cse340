document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".auth-form, .form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const email = form.querySelector("input[name='email']")?.value.trim();
      const password = form.querySelector("input[name='password']")?.value.trim();

      if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
        e.preventDefault();
        alert("⚠️ Please enter a valid email address.");
        return;
      }

      if (!password || password.length < 8) {
        e.preventDefault();
        alert("⚠️ Password must be at least 8 characters long.");
      }
    });
  });
});
