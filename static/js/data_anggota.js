const searchInput = document.querySelector("#member-search");
const memberTypeModal = document.querySelector(
    "#member-type-modal",
);
const memberTypeClose = document.querySelector(
    "#member-type-close",
);
const memberTypeOptions = document.querySelectorAll(
    ".member-type-option",
);
const governmentMemberModal = document.querySelector(
    "#government-member-modal",
);
const governmentMemberForm = document.querySelector(
    "#government-member-form",
);
const governmentMemberTitle = document.querySelector(
    "#government-member-title",
);
const governmentMemberClose = document.querySelector(
    "#government-member-close",
);
const governmentMemberCancel = document.querySelector(
    "#government-member-cancel",
);
const memberCategoryTabs = document.querySelectorAll(
    ".member-category-tab",
);
const memberCategory = document.querySelector(
    "#member-category",
);
const identityNumber = document.querySelector(
    "#member-identity-number",
);
const assignmentPeriod = document.querySelector(
    "#member-assignment-period",
);
const organizationName = document.querySelector(
    "#organization-name",
);
const organizationEmail = document.querySelector(
    "#organization-email",
);
const organizationAddress = document.querySelector(
    "#organization-address",
);
const totalOrganizationMembers = document.querySelector(
    "#total-organization-members",
);
const regionalRepresentatives = document.querySelector(
    "#regional-representatives",
);
const photoUrl = document.querySelector(
    "#member-photo-url",
);
const appointmentLetterUrl = document.querySelector(
    "#appointment-letter-url",
);
const statementLetterUrl = document.querySelector(
    "#statement-letter-url",
);
const removePhotoWrapper = document.querySelector(
    "#remove-photo-wrapper",
);
const removePhoto = document.querySelector(
    "#remove-photo",
);

const memberPhotoUrl = document.querySelector(
    "#member-photo-url",
);
const memberPhotoFile = document.querySelector(
    "#member-photo-file",
);
const memberPhotoPreview = document.querySelector(
    "#member-photo-preview",
);
const removePhotoButton = document.querySelector(
    "#remove-photo-button",
);
const removePhotoInput = document.querySelector(
    "#remove-photo",
);

const organizationChairName = document.querySelector(
    "#organization-chair-name",
);
const organizationChairPeriod = document.querySelector(
    "#organization-chair-period",
);
const organizationMemberCount = document.querySelector(
    "#organization-member-count",
);
const organizationContactPhone = document.querySelector(
    "#organization-contact-phone",
);
const organizationLogoUrl = document.querySelector(
    "#organization-logo-url",
);
const organizationLogoFile = document.querySelector(
    "#organization-logo-file",
);
const organizationLogoPreview = document.querySelector(
    "#organization-logo-preview",
);
const removeOrganizationLogoButton = document.querySelector(
    "#remove-organization-logo-button",
);
const removeOrganizationLogoInput = document.querySelector(
    "#remove-organization-logo",
);

const regionalGovernmentMemberModal = document.querySelector(
    "#regional-government-member-modal",
);

const regionalGovernmentMemberForm = document.querySelector(
    "#regional-government-member-form",
);

const regionalGovernmentMemberTitle = document.querySelector(
    "#regional-government-member-title",
);

const regionalGovernmentMemberClose = document.querySelector(
    "#regional-government-member-close",
);

const regionalGovernmentMemberCancel = document.querySelector(
    "#regional-government-member-cancel",
);

const memberRows = Array.from(
    document.querySelectorAll(
        ".member-category-panel tr[data-category], " +
        "#member-table-body tr[data-category]",
    ),
);
const memberVisibleCount = document.querySelector(
    "#member-visible-count",
);

function updateMemberRows() {
    const keyword = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    memberRows.forEach((row) => {
        const rowText = row.textContent.toLowerCase();
        const rowCategory = row.dataset.category;

        const matchesSearch = rowText.includes(keyword);
        row.hidden = !matchesSearch;
    });

    const selectedTab = Array.from(memberCategoryTabs).find(
        (tab) => tab.getAttribute("aria-selected") === "true",
    );
    const selectedPanel = selectedTab
        ? document.getElementById(
            selectedTab.getAttribute("aria-controls"),
        )
        : null;
    const rowsToCount = selectedPanel
        ? Array.from(
            selectedPanel.querySelectorAll("tr[data-category]"),
        )
        : memberRows;
    const visibleRows = rowsToCount.filter(
        (row) => !row.hidden
            && row.textContent.toLowerCase().includes(keyword),
    );

    if (memberVisibleCount) {
        memberVisibleCount.textContent = String(visibleRows.length);
    }
}

if (searchInput) {
    searchInput.addEventListener(
        "input",
        updateMemberRows,
    );
}

memberCategoryTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const selectedPanelId = tab.getAttribute(
            "aria-controls",
        );

        memberCategoryTabs.forEach((categoryTab) => {
            const panelId = categoryTab.getAttribute(
                "aria-controls",
            );
            const panel = document.getElementById(panelId);

            categoryTab.classList.remove(
                "member-category-tab--active",
            );
            categoryTab.setAttribute(
                "aria-selected",
                "false",
            );

            if (panel) {
                panel.hidden = panelId !== selectedPanelId;
            }
        });

        tab.classList.add("member-category-tab--active");
        tab.setAttribute("aria-selected", "true");
        updateMemberRows();
    });
});

updateMemberRows();

const memberModal = document.querySelector("#member-modal");
const memberForm = document.querySelector("#member-form");
const leaveMemberModal = document.querySelector(
    "#leave-member-modal",
);

const leaveMemberCancel = document.querySelector(
    "#leave-member-cancel",
);

const leaveMemberSave = document.querySelector(
    "#leave-member-save",
);
const memberModalTitle = document.querySelector("#member-modal-title");
const addMemberButton = document.querySelector("#add-member-button");
const memberModalClose = document.querySelector("#member-modal-close");
const deleteMemberModal = document.querySelector("#delete-member-modal");
const deleteMemberForm = document.querySelector("#delete-member-form");
const deleteMemberCancel = document.querySelector(
    "#delete-member-cancel",
);
const detailMemberModal = document.querySelector(
    "#detail-member-modal",
);
const detailTabsContainer = document.querySelector(
    "#detail-tabs",
);

const governmentDetailContent = document.querySelector(
    "#government-detail-content",
);

const regionalGovernmentDetailContent =
    document.querySelector(
        "#regional-government-detail-content",
    );

const regionalDetailPhoto = document.querySelector(
    "#regional-detail-photo",
);

const regionalDetailLogo = document.querySelector(
    "#regional-detail-logo",
);

const regionalDetailName = document.querySelector(
    "#regional-detail-name",
);

const regionalDetailRegion = document.querySelector(
    "#regional-detail-region",
);

const governmentDetailPhoto = document.querySelector(
    "#government-detail-photo",
);

const governmentDetailLogo = document.querySelector(
    "#government-detail-logo",
);

const governmentDetailName = document.querySelector(
    "#government-detail-name",
);

const governmentDetailPosition = document.querySelector(
    "#government-detail-position",
);

const governmentDetailMinistryName = document.querySelector(
    "#government-detail-ministry-name",
);
const governmentDetailTabs =
    governmentDetailContent
        ? governmentDetailContent.querySelectorAll(
            ".government-detail-tab",
        )
        : [];

const governmentDetailPanels =
    governmentDetailContent
        ? governmentDetailContent.querySelectorAll(
            ".government-detail-panel",
        )
        : [];

const regionalDetailTabs =
    regionalGovernmentDetailContent
        ? regionalGovernmentDetailContent.querySelectorAll(
            ".government-detail-tab",
        )
        : [];

const regionalDetailPanels =
    regionalGovernmentDetailContent
        ? regionalGovernmentDetailContent.querySelectorAll(
            ".government-detail-panel",
        )
        : [];

const detailMemberClose = document.querySelector(
    "#detail-member-close",
);
const detailProfile = document.querySelector(".detail-profile");
const detailTabs = Array.from(
    document.querySelectorAll(".detail-tab"),
);
const detailPanels = Array.from(
    document.querySelectorAll(".detail-panel"),
);
const membersDataElement = document.querySelector("#members-data");

const memberFormFields = {
    fullName: document.querySelector("#member-full-name"),
    email: document.querySelector("#member-email"),
    phone: document.querySelector("#member-phone"),
};

let membersData = [];
let memberFormHasChanges = false;

if (membersDataElement) {
    try {
        membersData = JSON.parse(membersDataElement.textContent);
    } catch (error) {
        console.error("Data anggota tidak dapat dibaca.", error);
    }
}

function closeMemberFormImmediately() {
    memberFormHasChanges = false;
    closeModal(leaveMemberModal);
    closeModal(memberModal);
}

function requestCloseMemberForm() {
    if (!memberFormHasChanges) {
        closeModal(memberModal);
        return;
    }

    if (leaveMemberModal) {
        leaveMemberModal.hidden = false;
    }
}

if (memberModalClose) {
    memberModalClose.addEventListener("click", () => {
        requestCloseMemberForm();
    });
}

if (leaveMemberCancel) {
    leaveMemberCancel.addEventListener("click", () => {
        closeModal(leaveMemberModal);
    });
}

if (leaveMemberSave) {
    leaveMemberSave.addEventListener("click", () => {
        if (!memberForm) {
            return;
        }

        memberForm.requestSubmit();
    });
}


function setFieldValue(field, value) {
    if (field) {
        field.value = value || "";
    }
}

function openMemberForm(member) {
    if (!memberModal || !memberForm) {
        console.error("Modal tambah anggota tidak ditemukan.");
        return;
    }

    const isEdit = Boolean(member);
    memberFormHasChanges = false;

    memberForm.action = isEdit
        ? `/anggota/${member.id}/edit`
        : "/anggota/tambah";

    if (memberModalTitle) {
        memberModalTitle.textContent = isEdit
            ? "Edit Data Anggota"
            : "Tambah Data Anggota";
    }

    setFieldValue(
        memberFormFields.fullName,
        isEdit ? member.name : "",
    );

    setFieldValue(
        memberFormFields.email,
        isEdit ? member.email : "",
    );

    setFieldValue(
        memberFormFields.phone,
        isEdit ? member.phone : "",
    );

    setFieldValue(
        identityNumber,
        isEdit ? member.identity_number : "",
    );

    setFieldValue(
        assignmentPeriod,
        isEdit ? member.assignment_period : "",
    );

    setFieldValue(
        organizationName,
        isEdit ? member.organization_name : "",
    );

    setFieldValue(
        organizationAddress,
        isEdit ? member.organization_address : "",
    );

    setFieldValue(
        organizationEmail,
        isEdit ? member.organization_email : "",
    );

    setFieldValue(
        organizationChairName,
        isEdit ? member.organization_chair_name : "",
    );

    setFieldValue(
        organizationChairPeriod,
        isEdit ? member.organization_chair_period : "",
    );

    setFieldValue(
        organizationMemberCount,
        isEdit ? member.organization_member_count : "",
    );

    setFieldValue(
        organizationContactPhone,
        isEdit ? member.organization_contact_phone : "",
    );

    setFieldValue(
        memberPhotoUrl,
        isEdit ? member.photo_url : "",
    );

    setFieldValue(
        appointmentLetterUrl,
        isEdit
            ? member.appointment_letter_url
                || member.appointmentLetterUrl
            : "",
    );

    setFieldValue(
        statementLetterUrl,
        isEdit
            ? member.statement_letter_url
                || member.statementLetterUrl
            : "",
    );

    setFieldValue(
        organizationLogoUrl,
        isEdit ? member.organization_logo_url : "",
    );

    if (organizationLogoFile) {
        organizationLogoFile.value = "";
    }

    if (organizationLogoPreview) {
        organizationLogoPreview.src =
            isEdit && member.organization_logo_url
                ? member.organization_logo_url
                : "/static/assets/icons/user.png";
    }

    if (removeOrganizationLogoInput) {
        removeOrganizationLogoInput.checked = false;
    }

    if (removeOrganizationLogoButton) {
        removeOrganizationLogoButton.hidden = !isEdit;
    }

    if (memberPhotoFile) {
        memberPhotoFile.value = "";
    }

    if (memberPhotoPreview) {
        memberPhotoPreview.src = isEdit && member.photo_url
            ? member.photo_url
            : "/static/assets/icons/user.png";
    }

    if (removePhotoInput) {
        removePhotoInput.checked = false;
    }

    if (removePhotoButton) {
        removePhotoButton.hidden = !isEdit;
    }

    if (organizationLogoFile && organizationLogoPreview) {
        organizationLogoFile.addEventListener("change", () => {
            const selectedFile = organizationLogoFile.files[0];

            if (!selectedFile) {
                return;
            }

            organizationLogoPreview.src = URL.createObjectURL(
                selectedFile,
            );

            if (removeOrganizationLogoInput) {
                removeOrganizationLogoInput.checked = false;
            }
        });
    }

    if (removeOrganizationLogoButton) {
        removeOrganizationLogoButton.addEventListener(
            "click",
            () => {
                if (organizationLogoUrl) {
                    organizationLogoUrl.value = "";
                }

                if (organizationLogoFile) {
                    organizationLogoFile.value = "";
                }

                if (removeOrganizationLogoInput) {
                    removeOrganizationLogoInput.checked = true;
                }

                if (organizationLogoPreview) {
                    organizationLogoPreview.src =
                        "/static/assets/icons/user.png";
                }

                removeOrganizationLogoButton.hidden = true;
            },
        );
    }

    memberModal.hidden = false;
    showMemberFormTab("profile");
}

function openGovernmentMemberForm(member) {
    if (!governmentMemberModal || !governmentMemberForm) {
        return;
    }

    const isEdit = Boolean(member);

    governmentMemberForm.action = isEdit
        ? `/anggota/${member.id}/edit-pemerintah`
        : "/anggota/tambah-pemerintah";

    if (governmentMemberTitle) {
        governmentMemberTitle.textContent = isEdit
            ? "Edit Anggota Pemerintah"
            : "Tambah Anggota Pemerintah";
    }

    const fullNameInput =
        governmentMemberForm.elements.full_name;

    const institutionInput =
        governmentMemberForm.elements.institution;

    const positionInput =
        governmentMemberForm.elements.position;

    if (fullNameInput) {
        fullNameInput.value = isEdit
            ? member.name || ""
            : "";
    }

    if (institutionInput) {
        institutionInput.value = isEdit
            ? member.institution || ""
            : "";
    }

    if (positionInput) {
        positionInput.value = isEdit
            ? member.position || ""
            : "";
    }

    const photoInput =
        governmentMemberForm.elements.photo_file;

    const logoInput =
        governmentMemberForm.elements.organization_logo_file;

    if (photoInput) {
        photoInput.value = "";
    }

    if (logoInput) {
        logoInput.value = "";
    }

    governmentMemberModal.hidden = false;
}

function openRegionalGovernmentMemberForm(member) {
    if (
        !regionalGovernmentMemberModal
        || !regionalGovernmentMemberForm
    ) {
        return;
    }

    const isEdit = Boolean(member);

    regionalGovernmentMemberForm.action = isEdit
        ? `/anggota/${member.id}/edit-pemerintah-daerah`
        : "/anggota/tambah-pemerintah-daerah";

    if (regionalGovernmentMemberTitle) {
        regionalGovernmentMemberTitle.textContent = isEdit
            ? "Edit Anggota Pemerintah Daerah"
            : "Tambah Anggota Pemerintah Daerah";
    }

    const fullNameInput =
        regionalGovernmentMemberForm.elements.full_name;

    const institutionInput =
        regionalGovernmentMemberForm.elements.institution;

    if (fullNameInput) {
        fullNameInput.value = isEdit
            ? member.name || ""
            : "";
    }

    if (institutionInput) {
        institutionInput.value = isEdit
            ? member.institution || ""
            : "";
    }

    const photoInput =
        regionalGovernmentMemberForm.elements.photo_file;

    const logoInput =
        regionalGovernmentMemberForm.elements.organization_logo_file;

    if (photoInput) {
        photoInput.value = "";
    }

    if (logoInput) {
        logoInput.value = "";
    }

    regionalGovernmentMemberModal.hidden = false;
}

document.querySelectorAll(".icon-action--edit").forEach((button) => {
    button.addEventListener("click", () => {
        const member = membersData.find(
            (item) => String(item.id) === button.dataset.memberId,
        );

        if (!member) {
            return;
        }

        if (member.category === "Pemerintah") {
            openGovernmentMemberForm(member);
            return;
        }

        if (member.category === "Pemerintah Daerah") {
            openRegionalGovernmentMemberForm(member);
            return;
        }

        openMemberForm(member);
    });
});

function findMemberById(memberId) {
    const normalizedId = String(memberId).trim();

    return membersData.find(
        (item) => String(item.id).trim() === normalizedId,
    );
}

function openMemberDetail(member) {
    if (!member || !detailMemberModal) {
        return;
    }

    if (regionalGovernmentDetailContent) {
        regionalGovernmentDetailContent.hidden = true;
    }

    const isGovernment =
        member.category === "Pemerintah";

    const isRegionalGovernment =
        member.category === "Pemerintah Daerah";

    if (detailTabsContainer) {
        detailTabsContainer.hidden =
            isGovernment || isRegionalGovernment;
    }

    if (governmentDetailContent) {
        governmentDetailContent.hidden = !isGovernment;
    }

    if (regionalGovernmentDetailContent) {
        regionalGovernmentDetailContent.hidden =
            !isRegionalGovernment;
    }

    if (detailProfile) {
        detailProfile.hidden =
            isGovernment || isRegionalGovernment;
    }

    detailPanels.forEach((panel) => {
        panel.hidden =
            isGovernment || isRegionalGovernment;
    });

    if (isGovernment) {
        if (governmentDetailPhoto) {
            governmentDetailPhoto.src =
                member.photo_url
                || "/static/assets/icons/user.png";
        }

        if (governmentDetailLogo) {
            governmentDetailLogo.src =
                member.organization_logo_url
                || "/static/assets/brand/logo-dsdan.png";
        }

        if (governmentDetailName) {
            governmentDetailName.textContent =
                member.name || "-";
        }

        if (governmentDetailPosition) {
            governmentDetailPosition.textContent =
                member.position || "-";
        }

        if (governmentDetailMinistryName) {
            governmentDetailMinistryName.textContent =
                member.institution || "-";
        }

        governmentDetailTabs.forEach((tab) => {
            const isActive =
                tab.dataset.governmentTab === "minister";

            tab.classList.toggle(
                "is-active",
                isActive,
            );

            tab.setAttribute(
                "aria-selected",
                String(isActive),
            );
        });

        governmentDetailPanels.forEach((panel) => {
            panel.hidden =
                panel.dataset.governmentPanel !== "minister";
        });

        detailMemberModal.hidden = false;
        return;
    }

    if (isRegionalGovernment) {
        if (regionalGovernmentDetailContent) {
            regionalGovernmentDetailContent.hidden = false;
            regionalDetailTabs.forEach((tab) => {
                const isActive =
                    tab.dataset.regionalTab === "governor";

                tab.classList.toggle("is-active", isActive);
                tab.setAttribute(
                    "aria-selected",
                    String(isActive),
                );
            });

            regionalDetailPanels.forEach((panel) => {
                panel.hidden =
                    panel.dataset.regionalPanel !== "governor";
            });
        }

        if (regionalDetailPhoto) {
            regionalDetailPhoto.src =
                member.photo_url
                || "/static/assets/icons/user.png";
        }

        if (regionalDetailLogo) {
            regionalDetailLogo.src =
                member.organization_logo_url
                || "/static/assets/brand/logo-dsdan.png";
        }

        if (regionalDetailName) {
            regionalDetailName.textContent =
                member.name || "-";
        }

        if (regionalDetailRegion) {
            regionalDetailRegion.textContent =
                member.institution || "-";
        }

        detailMemberModal.hidden = false;
        return;
    }

    document.querySelector("#detail-profile-name").textContent =
        member.name || "-";

    document.querySelector("#detail-email").textContent =
        member.email || "-";

    document.querySelector("#detail-phone").textContent =
        member.phone || "-";

    document.querySelector(
        "#detail-identity-number",
    ).textContent = member.identity_number || "-";

    document.querySelector(
        "#detail-assignment-period",
    ).textContent = member.assignment_period || "-";

    document.querySelector(
        "#detail-organization-name",
    ).textContent = member.organization_name || "-";

    document.querySelector(
        "#detail-organization-address",
    ).textContent = member.organization_address || "-";

    document.querySelector(
        "#detail-organization-chair-name",
    ).textContent = member.organization_chair_name || "-";

    document.querySelector(
        "#detail-organization-chair-period",
    ).textContent = member.organization_chair_period || "-";

    document.querySelector(
        "#detail-organization-member-count",
    ).textContent =
        member.organization_member_count ?? "-";

    document.querySelector(
        "#detail-organization-contact-phone",
    ).textContent =
        member.organization_contact_phone || "-";

    document.querySelector(
        "#detail-organization-email",
    ).textContent =
        member.organization_email || "-";

    const detailPhoto = document.querySelector(
        "#detail-photo",
    );

    if (detailPhoto) {
        detailPhoto.src =
            member.photo_url
            || "/static/assets/icons/user.png";
    }

    const detailOrganizationLogo =
        document.querySelector(
            "#detail-organization-logo",
        );

    if (detailOrganizationLogo) {
        detailOrganizationLogo.src =
            member.organization_logo_url
            || "/static/assets/brand/logo-dsdan.png";
    }

    const detailAppointmentLetter =
        document.querySelector(
            "#detail-appointment-letter",
        );

    const detailStatementLetter =
        document.querySelector(
            "#detail-statement-letter",
        );

    if (detailAppointmentLetter) {
        detailAppointmentLetter.hidden =
            !member.appointment_letter_url;

        detailAppointmentLetter.href =
            member.appointment_letter_url || "#";
    }

    if (detailStatementLetter) {
        detailStatementLetter.hidden =
            !member.statement_letter_url;

        detailStatementLetter.href =
            member.statement_letter_url || "#";
    }

    if (detailTabsContainer) {
        detailTabsContainer.hidden = false;
    }

    if (governmentDetailContent) {
        governmentDetailContent.hidden = true;
    }

    if (regionalGovernmentDetailContent) {
        regionalGovernmentDetailContent.hidden = true;
    }

    showDetailTab("profile");
    detailMemberModal.hidden = false;
}

document.addEventListener("click", (event) => {
    const button = event.target.closest(".detail-button");

    if (!button) {
        return;
    }

    const member = findMemberById(button.dataset.memberId);
    openMemberDetail(member);
});

if (addMemberButton) {
    addMemberButton.addEventListener("click", () => {
        if (memberTypeModal) {
            memberTypeModal.hidden = false;
        } else {
            openMemberForm(null);
        }
    });
}

if (memberTypeClose) {
    memberTypeClose.addEventListener("click", () => {
        closeModal(memberTypeModal);
    });
}

memberTypeOptions.forEach((option) => {
    option.addEventListener("click", () => {
        const memberType = option.dataset.memberType;

        closeModal(memberTypeModal);

        if (memberType === "government") {
            governmentMemberModal.hidden = false;
            return;
        }

        if (memberType === "non-government") {
            openMemberForm(null);
            return;
        }

        if (regionalGovernmentMemberModal) {
            regionalGovernmentMemberModal.hidden = false;
        }
    });
});

[governmentMemberClose, governmentMemberCancel].forEach(
    (button) => {
        if (button) {
            button.addEventListener("click", () => {
                closeModal(governmentMemberModal);
            });
        }
    },
);

[
    regionalGovernmentMemberClose,
    regionalGovernmentMemberCancel,
].forEach((button) => {
    if (button) {
        button.addEventListener("click", () => {
            closeModal(regionalGovernmentMemberModal);
        });
    }
});

[
    memberTypeModal,
    governmentMemberModal,
    regionalGovernmentMemberModal,
].forEach((modal) => {
    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    }
});

[memberTypeModal, governmentMemberModal].forEach((modal) => {
    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    }
});

document.querySelectorAll(".icon-action--delete").forEach((button) => {
    button.addEventListener("click", () => {
        if (!deleteMemberModal || !deleteMemberForm) {
            return;
        }

        deleteMemberForm.action =
            `/anggota/${button.dataset.memberId}/hapus`;
        deleteMemberModal.hidden = false;
    });
});

if (deleteMemberCancel) {
    deleteMemberCancel.addEventListener("click", () => {
        closeModal(deleteMemberModal);
    });
}

if (detailMemberClose) {
    detailMemberClose.addEventListener("click", () => {
        closeModal(detailMemberModal);
    });
}

[memberModal, deleteMemberModal, detailMemberModal, leaveMemberModal]
    .forEach((modal) => {
        if (!modal) {
            return;
        }

        modal.addEventListener("click", (event) => {
            if (event.target !== modal) {
                return;
            }

            if (modal === memberModal) {
                requestCloseMemberForm();
                return;
            }

            closeModal(modal);
        });
    });

if (memberForm) {
    memberForm.addEventListener("input", () => {
        memberFormHasChanges = true;
    });

    memberForm.addEventListener("change", () => {
        memberFormHasChanges = true;
    });
}

if (memberPhotoFile && memberPhotoPreview) {
    memberPhotoFile.addEventListener("change", () => {
        const selectedFile = memberPhotoFile.files[0];

        if (!selectedFile) {
            memberPhotoPreview.src = memberPhotoUrl.value
                || "/static/assets/icons/user.png";
            return;
        }

        memberPhotoPreview.src = URL.createObjectURL(
            selectedFile,
        );
        removePhotoInput.checked = false;
    });

    memberPhotoPreview.addEventListener("error", () => {
        memberPhotoPreview.src =
            "/static/assets/icons/user.png";
    });
}

if (removePhotoButton) {
    removePhotoButton.addEventListener("click", () => {
        memberPhotoUrl.value = "";
        if (memberPhotoFile) {
            memberPhotoFile.value = "";
        }
        removePhotoInput.checked = true;
        memberPhotoPreview.src =
            "/static/assets/icons/user.png";
        removePhotoButton.hidden = true;
    });
}

const memberFormTabs = Array.from(
    document.querySelectorAll(".member-form-tab"),
);

const memberFormPanels = Array.from(
    document.querySelectorAll(".member-form-panel"),
);

const memberFormBackButton = document.querySelector(
    "#member-form-back",
);

const memberFormNextButton = document.querySelector(
    "#member-form-next",
);

const memberFormSubmitButton = document.querySelector(
    "#member-form-submit",
);

let activeMemberFormTab = "profile";

function showMemberFormTab(tabName) {
    activeMemberFormTab = tabName;

    memberFormTabs.forEach((tab) => {
        const isActive = tab.dataset.formTab === tabName;

        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    memberFormPanels.forEach((panel) => {
        const isActive = panel.dataset.formPanel === tabName;

        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
    });

    const tabNames = [
        "profile",
        "organization",
        "documents",
    ];

    const currentIndex = tabNames.indexOf(tabName);
    const isFirstTab = currentIndex === 0;
    const isLastTab = currentIndex === tabNames.length - 1;

    if (memberFormBackButton) {
        memberFormBackButton.hidden = isFirstTab;
    }

    if (memberFormNextButton) {
        memberFormNextButton.hidden = isLastTab;
    }

    if (memberFormSubmitButton) {
        memberFormSubmitButton.hidden = !isLastTab;
    }
}

function validateCurrentMemberFormPanel() {
    const currentPanel = document.querySelector(
        `.member-form-panel[data-form-panel="${activeMemberFormTab}"]`,
    );

    if (!currentPanel) {
        return true;
    }

    const requiredFields = Array.from(
        currentPanel.querySelectorAll(
            "input[required], textarea[required], select[required]",
        ),
    );

    for (const field of requiredFields) {
        if (!field.checkValidity()) {
            field.reportValidity();
            return false;
        }
    }

    return true;
}

memberFormTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        showMemberFormTab(tab.dataset.formTab);
    });
});

if (memberFormNextButton) {
    memberFormNextButton.addEventListener("click", () => {
        if (!validateCurrentMemberFormPanel()) {
            return;
        }

        if (activeMemberFormTab === "profile") {
            showMemberFormTab("organization");
        } else if (activeMemberFormTab === "organization") {
            showMemberFormTab("documents");
        }
    });
}

if (memberFormBackButton) {
    memberFormBackButton.addEventListener("click", () => {
        if (activeMemberFormTab === "organization") {
            showMemberFormTab("profile");
        } else if (activeMemberFormTab === "documents") {
            showMemberFormTab("organization");
        }
    });
}

showMemberFormTab("profile");

function showDetailTab(tabName) {
    if (detailTabsContainer) {
        detailTabsContainer.hidden = false;
        detailTabsContainer.removeAttribute("hidden");
    }

    detailTabs.forEach((tab) => {
        const isActive = tab.dataset.detailTab === tabName;

        tab.classList.toggle("is-active", isActive);
        tab.setAttribute(
            "aria-selected",
            String(isActive),
        );
    });

    detailPanels.forEach((panel) => {
        const isActive =
            panel.dataset.detailPanel === tabName;

        panel.hidden = !isActive;

        if (isActive) {
            panel.removeAttribute("hidden");
        } else {
            panel.setAttribute("hidden", "");
        }
    });

    if (detailProfile) {
        detailProfile.hidden = tabName !== "profile";
    }

    if (governmentDetailContent) {
        governmentDetailContent.hidden = true;
    }

    if (regionalGovernmentDetailContent) {
        regionalGovernmentDetailContent.hidden = true;
    }
}

detailTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        showDetailTab(tab.dataset.detailTab);
    });
});

governmentDetailTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const selectedTab = tab.dataset.governmentTab;

        governmentDetailTabs.forEach((governmentTab) => {
            const isActive =
                governmentTab.dataset.governmentTab === selectedTab;

            governmentTab.classList.toggle(
                "is-active",
                isActive,
            );

            governmentTab.setAttribute(
                "aria-selected",
                String(isActive),
            );
        });

        governmentDetailPanels.forEach((panel) => {
            panel.hidden =
                panel.dataset.governmentPanel !== selectedTab;
        });
    });
});

regionalDetailTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const selectedTab =
            tab.dataset.regionalTab;

        regionalDetailTabs.forEach((regionalTab) => {
            const isActive =
                regionalTab.dataset.regionalTab ===
                selectedTab;

            regionalTab.classList.toggle(
                "is-active",
                isActive,
            );

            regionalTab.setAttribute(
                "aria-selected",
                String(isActive),
            );
        });

        regionalDetailPanels.forEach((panel) => {
            panel.hidden =
                panel.dataset.regionalPanel !==
                selectedTab;
        });
    });
});