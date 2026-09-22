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
const membershipNumber = document.querySelector(
    "#member-membership-number",
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

const memberRows = Array.from(
    document.querySelectorAll(
        ".member-category-panel tr[data-category], " +
        "#member-table-body tr[data-category]",
    ),
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

const governmentDetailInstitution = document.querySelector(
    "#government-detail-institution",
);
const detailMemberClose = document.querySelector(
    "#detail-member-close",
);
const detailProfile = document.querySelector(".detail-profile");
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
        membershipNumber,
        isEdit ? member.membership_number : "",
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

document.querySelectorAll(".icon-action--edit").forEach((button) => {
    button.addEventListener("click", () => {
        const member = membersData.find(
            (item) => String(item.id) === button.dataset.memberId,
        );

        if (member) {
            openMemberForm(member);
        }
    });
});

document.querySelectorAll(".detail-button").forEach((button) => {
    button.addEventListener("click", () => {
        const member = membersData.find(
            (item) => String(item.id) === button.dataset.memberId,
        );

        if (!member || !detailMemberModal) {
            return;
        }

        if (member.category === "Pemerintah") {
            if (detailTabsContainer) {
                detailTabsContainer.hidden = true;
            }

            if (detailProfile) {
                detailProfile.hidden = true;
            }

            detailPanels.forEach((panel) => {
                panel.hidden = true;
            });

            if (governmentDetailContent) {
                governmentDetailContent.hidden = false;
            }

            if (governmentDetailPhoto) {
                governmentDetailPhoto.src =
                    member.photo_url
                    || "/static/assets/icons/user.png";
            }

            if (governmentDetailLogo) {
                governmentDetailLogo.src =
                    member.organization_logo_url
                    || "/static/assets/icons/organization.png";
            }

            if (governmentDetailName) {
                governmentDetailName.textContent =
                    member.name || "-";
            }

            if (governmentDetailPosition) {
                governmentDetailPosition.textContent =
                    member.position || "-";
            }

            if (governmentDetailInstitution) {
                governmentDetailInstitution.textContent =
                    member.institution || "-";
            }

            detailMemberModal.hidden = false;
            return;
        }

        if (detailTabsContainer) {
            detailTabsContainer.hidden = false;
        }

        if (governmentDetailContent) {
            governmentDetailContent.hidden = true;
        }

        document.querySelector("#detail-name").textContent =
            member.name || "-";
        document.querySelector("#detail-profile-name").textContent =
            member.name || "-";
        document.querySelector("#detail-email").textContent =
            member.email || "-";
        document.querySelector("#detail-phone").textContent =
            member.phone || "-";

        const detailPhoto = document.querySelector("#detail-photo");
        const detailCategory = document.querySelector("#detail-category");
        const detailIdentityNumber = document.querySelector(
            "#detail-identity-number",
        );
        const detailMembershipNumber = document.querySelector(
            "#detail-membership-number",
        );
        const detailAppointmentLetter = document.querySelector(
            "#detail-appointment-letter",
        );
        const detailStatementLetter = document.querySelector(
            "#detail-statement-letter",
        );

        detailCategory.textContent = member.category || "-";

        detailIdentityNumber.textContent =
            member.identity_number || "-";

        detailMembershipNumber.textContent =
            member.membership_number || "-";

        document.querySelector("#detail-assignment-period").textContent =
            member.assignment_period || "-";

        document.querySelector("#detail-organization-name").textContent =
            member.organization_name || "-";

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
        ).textContent = member.organization_member_count ?? "-";

        document.querySelector(
            "#detail-organization-contact-phone",
        ).textContent = member.organization_contact_phone || "-";

        document.querySelector(
            "#detail-organization-email",
        ).textContent = member.organization_email || "-";

        detailPhoto.src = member.photo_url
            || "/static/assets/icons/user.png";

        const detailOrganizationLogo = document.querySelector(
            "#detail-organization-logo",
        );

        if (detailOrganizationLogo) {
            detailOrganizationLogo.src =
                member.organization_logo_url
                || "/static/assets/icons/user.png";
        }

        detailAppointmentLetter.hidden =
            !member.appointment_letter_url;

        detailAppointmentLetter.href =
            member.appointment_letter_url || "#";

        detailStatementLetter.hidden =
            !member.statement_letter_url;

        detailStatementLetter.href =
            member.statement_letter_url || "#";    
        detailMemberModal.hidden = false;
        showDetailTab("profile");
    });
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

        window.alert(
            "Form Anggota Pemerintah Daerah akan ditambahkan berikutnya.",
        );
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

const detailTabs = Array.from(
    document.querySelectorAll(".detail-tab"),
);

const detailPanels = Array.from(
    document.querySelectorAll(".detail-panel"),
);

function showDetailTab(tabName) {
    detailTabs.forEach((tab) => {
        const isActive = tab.dataset.detailTab === tabName;

        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    detailPanels.forEach((panel) => {
        panel.hidden = panel.dataset.detailPanel !== tabName;
    });

    if (detailProfile) {
        detailProfile.hidden = tabName !== "profile";
    }
}

detailTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        showDetailTab(tab.dataset.detailTab);
    });
});
