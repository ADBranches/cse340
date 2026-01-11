document.addEventListener("DOMContentLoaded", () => {
  const infoForm = document.getElementById("update-info-form");
  const pwdForm = document.getElementById("password-form");

  /* ------------------------------
     EMAIL VALIDATION (Live + On Submit)
  ------------------------------ */
  if (infoForm) {
    const emailInput = infoForm.querySelector("input[name='email']");
    const emailHint = document.createElement("div");
    emailHint.className = "validation-hint";
    emailInput.insertAdjacentElement("afterend", emailHint);

    const checkEmail = () => {
      const email = emailInput.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      emailHint.textContent = valid
        ? "Valid email format"
        : "Enter a valid email address";
      emailHint.style.color = valid ? "#046c3a" : "#a30000";
    };

    emailInput.addEventListener("input", checkEmail);

    infoForm.addEventListener("submit", (e) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
        e.preventDefault();
        emailHint.textContent = "Please enter a valid email address.";
        emailHint.style.color = "#a30000";
      }
    });
  }

  /* ------------------------------
     PASSWORD VALIDATION (Live + On Submit)
  ------------------------------ */
  if (pwdForm) {
    const pwdInput = pwdForm.querySelector("input[name='password']");
    const confirmInput = pwdForm.querySelector("input[name='confirm_password']");
    const hint = document.createElement("div");
    hint.className = "password-hint";
    pwdInput.insertAdjacentElement("afterend", hint);

    const validatePassword = () => {
      const pwd = pwdInput.value;

      const rules = [
        { test: pwd.length >= 8, msg: "At least 8 characters" },
        { test: /[A-Z]/.test(pwd), msg: "Contains an uppercase letter" },
        { test: /[a-z]/.test(pwd), msg: "Contains a lowercase letter" },
        { test: /[0-9]/.test(pwd), msg: "Contains a number" },
        { test: /[@$!%*?&]/.test(pwd), msg: "Contains a special character" }
      ];

      hint.innerHTML = rules
        .map(
          (r) =>
            `<span class="${r.test ? "ok" : "fail"}">${r.msg}</span>`
        )
        .join(" | ");
    };

    pwdInput.addEventListener("input", validatePassword);

    confirmInput.addEventListener("input", () => {
      confirmInput.setCustomValidity(
        confirmInput.value === pwdInput.value ? "" : "Passwords do not match"
      );
    });

    pwdForm.addEventListener("submit", (e) => {
      const pwd = pwdInput.value;
      const confirm = confirmInput.value;

      const valid =
        pwd.length >= 8 &&
        /[A-Z]/.test(pwd) &&
        /[a-z]/.test(pwd) &&
        /[0-9]/.test(pwd) &&
        /[@$!%*?&]/.test(pwd) &&
        pwd === confirm;

      if (!valid) {
        e.preventDefault();
        alert("Please ensure the password meets all requirements before submitting.");
      }
    });
  }
});
