// public/js/validate-account.js
document.addEventListener("DOMContentLoaded", () => {
  const infoForm = document.getElementById("update-info-form");
  const pwdForm = document.getElementById("password-form");

  if (infoForm) {
    infoForm.addEventListener("submit", (e) => {
      const email = infoForm.querySelector("input[name='email']").value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        e.preventDefault();
        alert("Please enter a valid email address.");
      }
    });
  }

  if (pwdForm) {
    pwdForm.addEventListener("submit", (e) => {
      const pwd = pwdForm.querySelector("input[name='password']").value;
      const confirm = pwdForm.querySelector("input[name='confirm_password']").value;

      const rules = [
        { test: pwd.length >= 8, msg: "8 + characters required" },
        { test: /[A-Z]/.test(pwd), msg: "one uppercase letter required" },
        { test: /[a-z]/.test(pwd), msg: "one lowercase letter required" },
        { test: /[0-9]/.test(pwd), msg: "one number required" },
        { test: /[@$!%*?&]/.test(pwd), msg: "one special character required" },
        { test: pwd === confirm, msg: "passwords must match" },
      ];

      const failed = rules.filter(r => !r.test);
      if (failed.length) {
        e.preventDefault();
        alert("Fix these issues:\n" + failed.map(f => "- " + f.msg).join("\n"));
      }
    });
  }
});
