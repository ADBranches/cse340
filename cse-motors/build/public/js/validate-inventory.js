document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    const year = document.querySelector("#inv_year").value;
    const price = document.querySelector("#inv_price").value;
    if (year < 2000 || year > new Date().getFullYear() + 1) {
      alert("Enter a valid vehicle year.");
      e.preventDefault();
    }
    if (price <= 0) {
      alert("Price must be greater than zero.");
      e.preventDefault();
    }
  });
});
