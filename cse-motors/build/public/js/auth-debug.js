/**
 * Auth Debug Helper — CSE Motors
 * Handles AJAX form submission with JSON-compatible behavior.
 */

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form.auth-form, form.form");

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = Object.fromEntries(new FormData(form).entries());
      const action = form.getAttribute("action");
      const method = form.getAttribute("method") || "POST";

      console.log("Sending request:", action, "with data:", formData);

      const statusBox = document.createElement("div");
      statusBox.className = "alert alert-info";
      statusBox.innerText = "Sending request...";
      form.prepend(statusBox);

      try {
        const res = await fetch(action, {
          method,
          headers: {
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: new FormData(form),
          redirect: "manual"
        });

        if (!res.ok) {
          const message = `Request failed (${res.status})`;
          statusBox.className = "alert alert-error";
          statusBox.innerText = message;

          console.error(message);
          console.error("Server response:", res.status, res.statusText);

          const text = await res.text();
          console.error("Response preview:", text.slice(0, 200));
          return;
        }

        const responseText = await res.text();
        statusBox.className = "alert alert-success";
        statusBox.innerText = "Request successful. Redirecting...";
        console.log("Success:", responseText);

        const redirectUrl = res.url || "/account/management";
        window.location.href = redirectUrl;
      } catch (err) {
        console.error("Fetch error:", err);
        statusBox.className = "alert alert-error";
        statusBox.innerText = "Network error or failed request.";
      }
    });
  });
});
