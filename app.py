import os
import uuid
from functools import wraps

from dotenv import load_dotenv
from flask import (
    Flask,
    flash,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from urllib.parse import urlparse
from PIL import Image, UnidentifiedImageError

load_dotenv()

from db import get_connection

app = Flask(__name__)

app.config.update(
    SECRET_KEY=os.environ.get(
        "SECRET_KEY",
        "development-secret-key-change-before-production",
    ),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get(
        "SESSION_COOKIE_SECURE",
        "false",
    ).lower() == "true",
)

PROFILE_UPLOAD_DIR = os.path.join(
    app.root_path,
    "static",
    "uploads",
    "profile",
)
PROFILE_UPLOAD_URL_PREFIX = "/static/uploads/profile/"
ALLOWED_PROFILE_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


ADMIN_EMAIL = os.environ.get(
    "ADMIN_EMAIL",
    "admin.dsdanasional@go.id",
)

ADMIN_PASSWORD_HASH = os.environ.get(
    "ADMIN_PASSWORD_HASH",
    generate_password_hash("admin123"),
)

VALID_CATEGORIES = {
    "Pemerintah",
    "Non-Pemerintah",
    "Pemerintah Daerah",
}


def login_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):
        if not session.get("admin_authenticated"):
            return redirect(url_for("login"))

        return view_function(*args, **kwargs)

    return wrapped_view


def get_members(archived=False):
    query = """
        SELECT
            id,
            category,
            institution,

            full_name AS name,
            identity_number,
            membership_number,
            assignment_period,
            phone,
            email,
            address,

            organization_name,
            organization_address,
            organization_chair_name,
            organization_chair_period,
            organization_member_count,
            organization_contact_phone,
            organization_email,

            photo_url,
            organization_logo_url,
            appointment_letter_url,
            statement_letter_url,

            is_archived,
            archived_at
        FROM members
        WHERE is_archived = %s
        ORDER BY full_name ASC
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, (archived,))
            return cursor.fetchall()

def get_member_statistics(members):
    return {
        "total_members": len(members),
        "government_members": sum(
            member["category"] == "Pemerintah"
            for member in members
        ),
        "non_government_members": sum(
            member["category"] == "Non-Pemerintah"
            for member in members
        ),
        "regional_government_members": sum(
            member["category"] == "Pemerintah Daerah"
            for member in members
        ),
    }

def normalize_optional_url(value):
    value = value.strip()

    if not value:
        return None

    parsed_url = urlparse(value)

    if parsed_url.scheme not in {"http", "https"}:
        raise ValueError("URL harus menggunakan http atau https.")

    if not parsed_url.netloc:
        raise ValueError("URL tidak valid.")

    return value


def save_profile_photo(uploaded_file):
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

    os.makedirs(PROFILE_UPLOAD_DIR, exist_ok=True)
    safe_name = secure_filename(uploaded_file.filename)
    base_name = os.path.splitext(safe_name)[0] or "profile"
    file_name = f"{uuid.uuid4().hex}-{base_name}{extension}"
    file_path = os.path.join(PROFILE_UPLOAD_DIR, file_name)
    uploaded_file.save(file_path)

    return f"{PROFILE_UPLOAD_URL_PREFIX}{file_name}"


def delete_local_profile_photo(photo_url):
    if not photo_url or not photo_url.startswith(
        PROFILE_UPLOAD_URL_PREFIX
    ):
        return

    file_name = photo_url.removeprefix(PROFILE_UPLOAD_URL_PREFIX)
    file_path = os.path.join(PROFILE_UPLOAD_DIR, file_name)

    if os.path.isfile(file_path):
        os.remove(file_path)

def get_non_government_form_values():
    def text_value(field_name):
        value = request.form.get(field_name, "").strip()
        return value or None

    def integer_value(field_name):
        value = request.form.get(field_name, "").strip()

        if not value:
            return None

        try:
            return int(value)
        except ValueError as error:
            raise ValueError(
                f"{field_name} harus berupa angka."
            ) from error

    return {
        "category": "Non-Pemerintah",

        "full_name": text_value("full_name"),
        "identity_number": text_value("identity_number"),
        "membership_number": text_value("membership_number"),
        "assignment_period": text_value("assignment_period"),
        "phone": text_value("phone"),
        "email": text_value("email"),
        "address": text_value("address"),

        "organization_name": text_value(
            "organization_name"
        ),
        "organization_address": text_value(
            "organization_address"
        ),
        "organization_chair_name": text_value(
            "organization_chair_name"
        ),
        "organization_chair_period": text_value(
            "organization_chair_period"
        ),
        "organization_member_count": integer_value(
            "organization_member_count"
        ),
        "organization_contact_phone": text_value(
            "organization_contact_phone"
        ),
        "organization_email": text_value(
            "organization_email"
        ),

        "photo_url": text_value("photo_url"),
        "organization_logo_url": text_value(
            "organization_logo_url"
        ),
        "appointment_letter_url": normalize_optional_url(
            request.form.get(
                "appointment_letter_url",
                "",
            )
        ),
        "statement_letter_url": normalize_optional_url(
            request.form.get(
                "statement_letter_url",
                "",
            )
        ),
    }

@app.route("/", methods=["GET"])
def index():
    if session.get("admin_authenticated"):
        return redirect(url_for("dashboard"))

    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if session.get("admin_authenticated"):
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        email_is_valid = email == ADMIN_EMAIL.lower()
        password_is_valid = check_password_hash(
            ADMIN_PASSWORD_HASH,
            password,
        )

        if email_is_valid and password_is_valid:
            session.clear()
            session["admin_authenticated"] = True
            session["admin_email"] = ADMIN_EMAIL

            return redirect(url_for("dashboard"))

        flash("Email atau kata sandi tidak sesuai.", "error")

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/dashboard", methods=["GET"])
@login_required
def dashboard():
    active_members = get_members()
    statistics = get_member_statistics(active_members)

    return render_template(
        "members.html",
        page_type="dashboard",
        active_page="dashboard",
        page_title="Dashboard",
        page_heading=(
            "DATABASE ANGGOTA DEWAN SUMBER DAYA AIR NASIONAL"
        ),
        members=active_members,
        **statistics,
    )


@app.route("/anggota", methods=["GET"])
@login_required
def anggota():
    active_members = get_members()

    return render_template(
        "data_anggota.html",
        page_type="members",
        active_page="anggota",
        page_title="Data Anggota",
        page_heading=(
            "DATA ANGGOTA DEWAN SUMBER DAYA AIR NASIONAL"
        ),
        members=active_members,
    )


@app.route("/arsip-anggota", methods=["GET"])
@login_required
def arsip_anggota():
    archived_members = get_members(archived=True)

    return render_template(
        "members.html",
        page_type="archive",
        active_page="arsip",
        page_title="Arsip Anggota",
        page_heading=(
            "ARSIP ANGGOTA DEWAN SUMBER DAYA AIR NASIONAL"
        ),
        members=archived_members,
    )


@app.route("/anggota/tambah", methods=["POST"])
@login_required
def tambah_anggota():
    try:
        values = get_non_government_form_values()
        uploaded_photo_url = save_profile_photo(
            request.files.get("photo_file"),
        )

        uploaded_organization_logo_url = save_profile_photo(
            request.files.get("organization_logo_file"),
        )
    except ValueError as error:
        flash(str(error), "error")
        return redirect(url_for("anggota"))

    if uploaded_photo_url:
        values["photo_url"] = uploaded_photo_url

    if uploaded_organization_logo_url:
        values["organization_logo_url"] = (
            uploaded_organization_logo_url
        )

    if not values["full_name"]:
        flash("Nama lengkap wajib diisi.", "error")
        return redirect(url_for("anggota"))

    if not values["identity_number"]:
        flash("NIK wajib diisi.", "error")
        return redirect(url_for("anggota"))

    if not values["organization_name"]:
        flash(
            "Nama asosiasi atau organisasi wajib diisi.",
            "error",
        )
        return redirect(url_for("anggota"))

    query = """
        INSERT INTO members (
            category,
            institution,

            full_name,
            identity_number,
            membership_number,
            assignment_period,
            phone,
            email,
            address,

            organization_name,
            organization_address,
            organization_chair_name,
            organization_chair_period,
            organization_member_count,
            organization_contact_phone,
            organization_email,

            photo_url,
            organization_logo_url,
            appointment_letter_url,
            statement_letter_url
        )
        VALUES (
            %(category)s,
            %(organization_name)s,

            %(full_name)s,
            %(identity_number)s,
            %(membership_number)s,
            %(assignment_period)s,
            %(phone)s,
            %(email)s,
            %(address)s,

            %(organization_name)s,
            %(organization_address)s,
            %(organization_chair_name)s,
            %(organization_chair_period)s,
            %(organization_member_count)s,
            %(organization_contact_phone)s,
            %(organization_email)s,

            %(photo_url)s,
            %(organization_logo_url)s,
            %(appointment_letter_url)s,
            %(statement_letter_url)s
        )
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, values)

    flash(
        "Data anggota berhasil ditambahkan.",
        "success",
    )
    return redirect(url_for("anggota"))

@app.route("/anggota/tambah-pemerintah", methods=["POST"])
@login_required
def tambah_pemerintah():
    full_name = request.form.get(
        "full_name",
        "",
    ).strip()

    institution = request.form.get(
        "institution",
        "",
    ).strip()

    position = request.form.get(
        "position",
        "",
    ).strip()

    if not full_name or not institution or not position:
        flash(
            "Nama menteri, kementerian, dan jabatan wajib diisi.",
            "error",
        )
        return redirect(url_for("anggota"))

    try:
        logo_url = save_profile_photo(
            request.files.get("organization_logo_file"),
        )
        photo_url = save_profile_photo(
            request.files.get("photo_file"),
        )
    except ValueError as error:
        flash(str(error), "error")
        return redirect(url_for("anggota"))

    query = """
        INSERT INTO members (
            category,
            institution,
            full_name,
            position,
            organization_name,
            photo_url,
            organization_logo_url
        )
        VALUES (
            'Pemerintah',
            %(institution)s,
            %(full_name)s,
            %(position)s,
            %(institution)s,
            %(photo_url)s,
            %(logo_url)s
        )
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                query,
                {
                    "institution": institution,
                    "full_name": full_name,
                    "position": position,
                    "photo_url": photo_url,
                    "logo_url": logo_url,
                },
            )

    flash(
        "Data anggota pemerintah berhasil ditambahkan.",
        "success",
    )
    return redirect(url_for("anggota"))

@app.route(
    "/anggota/<int:member_id>/edit",
    methods=["POST"],
)
@login_required
def edit_anggota(member_id):
    try:
        values = get_non_government_form_values()
        uploaded_photo_url = save_profile_photo(
            request.files.get("photo_file"),
        )

        uploaded_organization_logo_url = save_profile_photo(
            request.files.get("organization_logo_file"),
        )
    except ValueError as error:
        flash(str(error), "error")
        return redirect(url_for("anggota"))

    if not values["full_name"]:
        flash("Nama lengkap wajib diisi.", "error")
        return redirect(url_for("anggota"))

    if not values["identity_number"]:
        flash("NIK wajib diisi.", "error")
        return redirect(url_for("anggota"))

    if not values["organization_name"]:
        flash(
            "Nama asosiasi atau organisasi wajib diisi.",
            "error",
        )
        return redirect(url_for("anggota"))

    old_photo_url = values["photo_url"]

    old_organization_logo_url = values[
        "organization_logo_url"
    ]

    if uploaded_photo_url:
        values["photo_url"] = uploaded_photo_url
        delete_local_profile_photo(old_photo_url)
    elif request.form.get("remove_photo") == "on":
        values["photo_url"] = None
        delete_local_profile_photo(old_photo_url)

    if uploaded_organization_logo_url:
        values["organization_logo_url"] = (
            uploaded_organization_logo_url
        )
        delete_local_profile_photo(
            old_organization_logo_url
        )
    elif request.form.get(
        "remove_organization_logo"
    ) == "on":
        values["organization_logo_url"] = None
        delete_local_profile_photo(
            old_organization_logo_url
        )

    values["member_id"] = member_id

    query = """
        UPDATE members
        SET
            institution = %(organization_name)s,
            full_name = %(full_name)s,
            identity_number = %(identity_number)s,
            membership_number = %(membership_number)s,
            assignment_period = %(assignment_period)s,
            phone = %(phone)s,
            email = %(email)s,
            address = %(address)s,

            organization_name = %(organization_name)s,
            organization_address = %(organization_address)s,
            organization_chair_name = %(organization_chair_name)s,
            organization_chair_period = %(organization_chair_period)s,
            organization_member_count =
                %(organization_member_count)s,
            organization_contact_phone =
                %(organization_contact_phone)s,
            organization_email = %(organization_email)s,

            photo_url = %(photo_url)s,
            organization_logo_url =
                %(organization_logo_url)s,
            appointment_letter_url =
                %(appointment_letter_url)s,
            statement_letter_url =
                %(statement_letter_url)s,

            updated_at = CURRENT_TIMESTAMP
        WHERE id = %(member_id)s
          AND category = 'Non-Pemerintah'
          AND is_archived = FALSE
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, values)

            if cursor.rowcount == 0:
                flash(
                    "Data anggota tidak ditemukan.",
                    "error",
                )
                return redirect(url_for("anggota"))

    flash(
        "Data anggota berhasil diperbarui.",
        "success",
    )
    return redirect(url_for("anggota"))

@app.route(
    "/anggota/<int:member_id>/hapus",
    methods=["POST"],
)
@login_required
def hapus_anggota(member_id):
    query = """
        DELETE FROM members
        WHERE id = %s
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, (member_id,))

            if cursor.rowcount == 0:
                flash(
                    "Data anggota tidak ditemukan.",
                    "error",
                )
                return redirect(url_for("anggota"))

    flash(
        "Data anggota berhasil dihapus.",
        "success",
    )
    return redirect(url_for("anggota"))

if __name__ == "__main__":
    app.run(debug=True)