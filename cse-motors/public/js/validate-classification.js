document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    const name = document.querySelector("#classification_name").value.trim();
    if (name.length < 3) {
      alert("Classification name must be at least 3 characters.");
      e.preventDefault();
    }
  });
});
