import os
import uuid

from PIL import Image, UnidentifiedImageError
from werkzeug.utils import secure_filename


PROFILE_UPLOAD_URL_PREFIX = "/static/uploads/profile/"
ALLOWED_PROFILE_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


def init_upload_paths(app):
    app.config["PROFILE_UPLOAD_DIR"] = os.path.join(
        app.root_path,
        "static",
        "uploads",
        "profile",
    )


def save_profile_photo(uploaded_file, upload_dir):
    if not uploaded_file or not uploaded_file.filename:
        return None

    extension = ALLOWED_PROFILE_IMAGE_TYPES.get(
        uploaded_file.content_type,
    )
    if not extension:
        raise ValueError(
            "Foto profil harus berformat JPG, PNG, atau WEBP."
        )

    try:
        image = Image.open(uploaded_file.stream)
        image.verify()
    except (UnidentifiedImageError, OSError) as error:
        raise ValueError("File foto profil tidak valid.") from error
    finally:
        uploaded_file.stream.seek(0)

    os.makedirs(upload_dir, exist_ok=True)
    safe_name = secure_filename(uploaded_file.filename)
    base_name = os.path.splitext(safe_name)[0] or "profile"
    file_name = f"{uuid.uuid4().hex}-{base_name}{extension}"
    file_path = os.path.join(upload_dir, file_name)
    uploaded_file.save(file_path)

    return f"{PROFILE_UPLOAD_URL_PREFIX}{file_name}"


def delete_local_profile_photo(photo_url, upload_dir):
    if not photo_url or not photo_url.startswith(
        PROFILE_UPLOAD_URL_PREFIX
    ):
        return

    file_name = photo_url.removeprefix(PROFILE_UPLOAD_URL_PREFIX)
    file_path = os.path.join(upload_dir, file_name)

    if os.path.isfile(file_path):
        os.remove(file_path)
