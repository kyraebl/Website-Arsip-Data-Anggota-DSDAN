const imageCropModal = document.querySelector(
    "#image-crop-modal",
);
const imageCropPreview = document.querySelector(
    "#image-crop-preview",
);
const imageCropClose = document.querySelector(
    "#image-crop-close",
);
const imageCropCancel = document.querySelector(
    "#image-crop-cancel",
);
const imageCropApply = document.querySelector(
    "#image-crop-apply",
);
const cropMemberPhotoButton = document.querySelector(
    "#crop-member-photo-button",
);
const cropOrganizationLogoButton = document.querySelector(
    "#crop-organization-logo-button",
);
const memberPhotoFileForCrop = document.querySelector(
    "#member-photo-file",
);
const memberPhotoPreviewForCrop = document.querySelector(
    "#member-photo-preview",
);
const organizationLogoFileForCrop = document.querySelector(
    "#organization-logo-file",
);
const organizationLogoPreviewForCrop = document.querySelector(
    "#organization-logo-preview",
);
const removePhotoInputForCrop = document.querySelector(
    "#remove-photo",
);
const removeOrganizationLogoInputForCrop = document.querySelector(
    "#remove-organization-logo",
);

let activeCropInput = null;
let activeCropPreview = null;
let imageCropper = null;
let imageCropObjectUrl = null;

function openImageCropper(fileInput, previewElement) {
    const selectedFile = fileInput.files[0];

    if (!selectedFile) {
        return;
    }

    if (imageCropObjectUrl) {
        URL.revokeObjectURL(imageCropObjectUrl);
    }

    imageCropObjectUrl = URL.createObjectURL(selectedFile);
    activeCropInput = fileInput;
    activeCropPreview = previewElement;
    imageCropPreview.src = imageCropObjectUrl;
    imageCropModal.hidden = false;

    imageCropPreview.onload = () => {
        if (imageCropper) {
            imageCropper.destroy();
        }

        imageCropper = new Cropper(
            imageCropPreview,
            {
                aspectRatio: 1,
                viewMode: 1,
                dragMode: "move",
                autoCropArea: 0.9,
                responsive: true,
                background: false,
            },
        );
    };
}

function closeImageCropper() {
    if (imageCropper) {
        imageCropper.destroy();
        imageCropper = null;
    }

    if (imageCropObjectUrl) {
        URL.revokeObjectURL(imageCropObjectUrl);
        imageCropObjectUrl = null;
    }

    activeCropInput = null;
    activeCropPreview = null;

    if (imageCropModal) {
        imageCropModal.hidden = true;
    }
}

function applyImageCrop() {
    if (!imageCropper || !activeCropInput) {
        return;
    }

    imageCropper.getCroppedCanvas({
        width: 800,
        height: 800,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
    }).toBlob(
        (croppedBlob) => {
            if (!croppedBlob) {
                console.error(
                    "Gambar hasil crop tidak dapat dibuat.",
                );
                return;
            }

            const originalFile = activeCropInput.files[0];
            const croppedFile = new File(
                [croppedBlob],
                originalFile.name,
                {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                },
            );

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(croppedFile);
            activeCropInput.files = dataTransfer.files;

            if (activeCropPreview) {
                activeCropPreview.src = URL.createObjectURL(
                    croppedBlob,
                );
            }

            closeImageCropper();
        },
        "image/jpeg",
        0.9,
    );
}

if (memberPhotoFileForCrop && memberPhotoPreviewForCrop) {
    memberPhotoFileForCrop.addEventListener("change", () => {
        const selectedFile = memberPhotoFileForCrop.files[0];

        if (!selectedFile) {
            cropMemberPhotoButton.hidden = true;
            return;
        }

        memberPhotoPreviewForCrop.src = URL.createObjectURL(
            selectedFile,
        );
        cropMemberPhotoButton.hidden = false;

        if (removePhotoInputForCrop) {
            removePhotoInputForCrop.checked = false;
        }
    });
}

if (
    organizationLogoFileForCrop
    && organizationLogoPreviewForCrop
) {
    organizationLogoFileForCrop.addEventListener(
        "change",
        () => {
            const selectedFile =
                organizationLogoFileForCrop.files[0];

            if (!selectedFile) {
                cropOrganizationLogoButton.hidden = true;
                return;
            }

            organizationLogoPreviewForCrop.src =
                URL.createObjectURL(selectedFile);
            cropOrganizationLogoButton.hidden = false;

            if (removeOrganizationLogoInputForCrop) {
                removeOrganizationLogoInputForCrop.checked = false;
            }
        },
    );
}

if (cropMemberPhotoButton) {
    cropMemberPhotoButton.addEventListener("click", () => {
        openImageCropper(
            memberPhotoFileForCrop,
            memberPhotoPreviewForCrop,
        );
    });
}

if (cropOrganizationLogoButton) {
    cropOrganizationLogoButton.addEventListener("click", () => {
        openImageCropper(
            organizationLogoFileForCrop,
            organizationLogoPreviewForCrop,
        );
    });
}

if (imageCropApply) {
    imageCropApply.addEventListener(
        "click",
        applyImageCrop,
    );
}

if (imageCropCancel) {
    imageCropCancel.addEventListener(
        "click",
        closeImageCropper,
    );
}

if (imageCropClose) {
    imageCropClose.addEventListener(
        "click",
        closeImageCropper,
    );
}

if (imageCropModal) {
    imageCropModal.addEventListener("click", (event) => {
        if (event.target === imageCropModal) {
            closeImageCropper();
        }
    });
}
