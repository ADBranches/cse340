/**
 * Auth Debug Helper — CSE Motors
 * Handles AJAX form submission with developer + user feedback
 * ✅ Harmonized with Express body parser (JSON payload)
 */

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form.auth-form, form.form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Collect form data
      const formData = Object.fromEntries(new FormData(form).entries());
      const action = form.getAttribute("action");
      const method = form.getAttribute("method") || "POST";

      console.log("📡 Sending request to:", action, "with data:", formData);

      // Create visual feedback element
      const statusBox = document.createElement("div");
      statusBox.className = "alert alert-info";
      statusBox.innerText = "⏳ Sending request...";
      form.prepend(statusBox);

      try {
        const res = await fetch(action, {
          method,
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest" // 👈 enables req.xhr on Express
          },
          body: new FormData(form), // ✅ send form data natively
          redirect: "manual"
        });

        // Handle server response
        if (!res.ok) {
          const message = `❌ Request failed (${res.status})`;
          statusBox.className = "alert alert-error";
          statusBox.innerText = message;
          console.error(message);
          console.error("Server responded:", res.status, res.statusText);

          // If backend sends HTML error page, log a snippet
          const text = await res.text();
          console.error("Response body preview:", text.slice(0, 200));
          return;
        }

        // Parse and display success info
        const responseText = await res.text();
        statusBox.className = "alert alert-success";
        statusBox.innerText = "✅ Request successful! Redirecting...";
        console.log("✅ Success:", responseText);

        // Follow redirect if backend sends one
        const redirectUrl = res.url || "/account/management";
        window.location.href = redirectUrl;
      } catch (err) {
        console.error("💥 Fetch error:", err);
        statusBox.className = "alert alert-error";
        statusBox.innerText = "💥 Network error or dead request";
      }
    });
  });
});
