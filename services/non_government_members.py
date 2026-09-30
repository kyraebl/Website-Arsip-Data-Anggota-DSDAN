from db import get_connection
from services.form_helpers import (
    integer_value,
    normalize_optional_url,
    text_value,
)
from services.uploads import delete_local_profile_photo, save_profile_photo


def get_form_values(form):
    return {
        "full_name": text_value(form, "full_name"),
        "identity_number": text_value(form, "identity_number"),
        "assignment_period": text_value(form, "assignment_period"),
        "phone": text_value(form, "phone"),
        "email": text_value(form, "email"),
        "address": text_value(form, "address"),
        "organization_name": text_value(form, "organization_name"),
        "organization_address": text_value(form, "organization_address"),
        "organization_chair_name": text_value(
            form,
            "organization_chair_name",
        ),
        "organization_chair_period": text_value(
            form,
            "organization_chair_period",
        ),
        "organization_member_count": integer_value(
            form,
            "organization_member_count",
        ),
        "organization_contact_phone": text_value(
            form,
            "organization_contact_phone",
        ),
        "organization_email": text_value(form, "organization_email"),
        "photo_url": text_value(form, "photo_url"),
        "organization_logo_url": text_value(
            form,
            "organization_logo_url",
        ),
        "appointment_letter_url": normalize_optional_url(
            form.get("appointment_letter_url", "")
        ),
        "statement_letter_url": normalize_optional_url(
            form.get("statement_letter_url", "")
        ),
    }


def validate(values):
    if not values["full_name"]:
        raise ValueError("Nama lengkap wajib diisi.")
    if not values["identity_number"]:
        raise ValueError("NIK wajib diisi.")
    if not values["organization_name"]:
        raise ValueError("Nama asosiasi atau organisasi wajib diisi.")


def _save_uploads(values, files, upload_dir):
    photo_url = save_profile_photo(files.get("photo_file"), upload_dir)
    logo_url = save_profile_photo(
        files.get("organization_logo_file"),
        upload_dir,
    )
    if photo_url:
        values["photo_url"] = photo_url
    if logo_url:
        values["organization_logo_url"] = logo_url


def create_member(form, files, upload_dir):
    values = get_form_values(form)
    _save_uploads(values, files, upload_dir)
    validate(values)

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO anggota (
                    jenis_anggota, nama_tampilan, instansi_tampilan,
                    foto_tampilan
                )
                VALUES (
                    'Non-Pemerintah', %(full_name)s,
                    %(organization_name)s, %(photo_url)s
                )
                """,
                values,
            )
            member_id = cursor.lastrowid
            cursor.execute(
                """
                INSERT INTO anggota_non_pemerintah (
                    anggota_id, foto_organisasi, nama_organisasi,
                    nama_ketua_organisasi, periode_jabatan_ketua,
                    telepon_organisasi, email_organisasi,
                    alamat_organisasi, foto_perwakilan, nama_lengkap,
                    nik, telepon, email, alamat,
                    periode_penugasan, jumlah_anggota,
                    surat_penunjukan_url, surat_pernyataan_url
                )
                VALUES (
                    %(member_id)s, %(organization_logo_url)s,
                    %(organization_name)s, %(organization_chair_name)s,
                    %(organization_chair_period)s,
                    %(organization_contact_phone)s,
                    %(organization_email)s, %(organization_address)s,
                    %(photo_url)s, %(full_name)s, %(identity_number)s,
                    %(phone)s, %(email)s,
                    %(address)s, %(assignment_period)s,
                    %(organization_member_count)s,
                    %(appointment_letter_url)s,
                    %(statement_letter_url)s
                )
                """,
                {**values, "member_id": member_id},
            )


def update_member(member_id, form, files, upload_dir):
    values = get_form_values(form)
    validate(values)

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT np.*
                FROM anggota a
                JOIN anggota_non_pemerintah np ON np.anggota_id = a.id
                WHERE a.id = %s
                  AND a.jenis_anggota = 'Non-Pemerintah'
                  AND a.status_arsip = FALSE
                """,
                (member_id,),
            )
            old_member = cursor.fetchone()
            if not old_member:
                raise LookupError("Data anggota tidak ditemukan.")

            _save_uploads(values, files, upload_dir)
            values["photo_url"] = values["photo_url"] or old_member[
                "foto_perwakilan"
            ]
            values["organization_logo_url"] = (
                values["organization_logo_url"]
                or old_member["foto_organisasi"]
            )
            if form.get("remove_photo") == "on":
                values["photo_url"] = None
            if form.get("remove_organization_logo") == "on":
                values["organization_logo_url"] = None

            cursor.execute(
                """
                UPDATE anggota
                SET nama_tampilan = %s, instansi_tampilan = %s,
                    foto_tampilan = %s,
                    diperbarui_pada = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (
                    values["full_name"],
                    values["organization_name"],
                    values["photo_url"],
                    member_id,
                ),
            )
            cursor.execute(
                """
                UPDATE anggota_non_pemerintah
                SET foto_organisasi = %(organization_logo_url)s,
                    nama_organisasi = %(organization_name)s,
                    nama_ketua_organisasi = %(organization_chair_name)s,
                    periode_jabatan_ketua = %(organization_chair_period)s,
                    telepon_organisasi = %(organization_contact_phone)s,
                    email_organisasi = %(organization_email)s,
                    alamat_organisasi = %(organization_address)s,
                    foto_perwakilan = %(photo_url)s,
                    nama_lengkap = %(full_name)s,
                    nik = %(identity_number)s,
                    telepon = %(phone)s, email = %(email)s,
                    alamat = %(address)s,
                    periode_penugasan = %(assignment_period)s,
                    jumlah_anggota = %(organization_member_count)s,
                    surat_penunjukan_url = %(appointment_letter_url)s,
                    surat_pernyataan_url = %(statement_letter_url)s
                WHERE anggota_id = %(member_id)s
                """,
                {**values, "member_id": member_id},
            )

    if values["photo_url"] != old_member["foto_perwakilan"]:
        delete_local_profile_photo(old_member["foto_perwakilan"], upload_dir)
    if values["organization_logo_url"] != old_member["foto_organisasi"]:
        delete_local_profile_photo(
            old_member["foto_organisasi"],
            upload_dir,
        )
