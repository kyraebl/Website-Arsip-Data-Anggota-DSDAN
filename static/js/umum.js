const sidebarToggle = document.querySelector("#sidebar-toggle");
const adminLayout = document.querySelector(".admin-layout");

if (sidebarToggle && adminLayout) {
    sidebarToggle.addEventListener("click", () => {
        const isCollapsed = adminLayout.classList.toggle(
            "sidebar-collapsed",
        );

        sidebarToggle.setAttribute(
            "aria-expanded",
            String(!isCollapsed),
        );

        sidebarToggle.setAttribute(
            "aria-label",
            isCollapsed
                ? "Buka navigasi"
                : "Tutup navigasi",
        );
    });
}

const adminMenuToggle = document.querySelector(
    "#admin-menu-toggle",
);
const adminMenu = document.querySelector("#admin-menu");
const logoutButton = document.querySelector("#logout-button");
const logoutModal = document.querySelector("#logout-modal");
const cancelLogout = document.querySelector("#cancel-logout");

if (adminMenuToggle && adminMenu) {
    adminMenuToggle.addEventListener("click", () => {
        const menuIsOpen = adminMenu.hidden;

        adminMenu.hidden = !menuIsOpen;
        adminMenuToggle.setAttribute(
            "aria-expanded",
            String(menuIsOpen),
        );
    });
}

if (logoutButton && logoutModal) {
    logoutButton.addEventListener("click", () => {
        logoutModal.hidden = false;

        if (adminMenu) {
            adminMenu.hidden = true;
        }

        if (adminMenuToggle) {
            adminMenuToggle.setAttribute(
                "aria-expanded",
                "false",
            );
        }
    });
}

if (cancelLogout && logoutModal) {
    cancelLogout.addEventListener("click", () => {
        logoutModal.hidden = true;
    });
}

if (logoutModal) {
    logoutModal.addEventListener("click", (event) => {
        if (event.target === logoutModal) {
            logoutModal.hidden = true;
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && logoutModal) {
        logoutModal.hidden = true;
    }
});

function closeModal(modal) {
    if (modal) {
        modal.hidden = true;
    }
}
