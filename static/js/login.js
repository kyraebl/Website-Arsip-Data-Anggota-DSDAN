const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#password-toggle");
const passwordToggleIcon = document.querySelector(
    "#password-toggle-icon",
);

if (passwordInput && passwordToggle && passwordToggleIcon) {
    passwordToggle.addEventListener("click", () => {
        const passwordIsHidden = passwordInput.type === "password";

        passwordInput.type = passwordIsHidden
            ? "text"
            : "password";

        passwordToggleIcon.src = passwordIsHidden
            ? "/static/assets/icons/hide.png"
            : "/static/assets/icons/view.png";

        passwordToggle.setAttribute(
            "aria-label",
            passwordIsHidden
                ? "Sembunyikan kata sandi"
                : "Tampilkan kata sandi",
        );
    });
}