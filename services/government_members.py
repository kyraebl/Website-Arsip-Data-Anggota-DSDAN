from db import get_connection
from services.form_helpers import text_value
from services.uploads import delete_local_profile_photo, save_profile_photo


def get_form_values(form):
    return {
        "institution": text_value(form, "institution"),
        "position": text_value(form, "position"),
        "full_name": text_value(form, "full_name"),
        "photo_url": text_value(form, "photo_url"),
        "organization_logo_url": text_value(
            form,
            "organization_logo_url",
        ),
    }


def validate(values):
    if not values["full_name"]:
        raise ValueError("Nama menteri wajib diisi.")
    if not values["institution"]:
        raise ValueError("Nama kementerian atau lembaga wajib diisi.")
    if not values["position"]:
        raise ValueError("Jabatan wajib diisi.")


def create_member(form, files, upload_dir):
    values = get_form_values(form)
    photo_url = save_profile_photo(files.get("photo_file"), upload_dir)
    logo_url = save_profile_photo(
        files.get("organization_logo_file"),
        upload_dir,
    )
    if photo_url:
        values["photo_url"] = photo_url
    if logo_url:
        values["organization_logo_url"] = logo_url
    validate(values)

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO anggota (
                    jenis_anggota, nama_tampilan, instansi_tampilan,
                    position, foto_tampilan
                )
                VALUES (
                    'Pemerintah', %(full_name)s, %(institution)s,
                    %(position)s, %(photo_url)s
                )
                """,
                values,
            )
            member_id = cursor.lastrowid
            cursor.execute(
                """
                INSERT INTO anggota_pemerintah (
                    anggota_id, logo_kementerian, nama_kementerian,
                    foto_menteri, nama_menteri
                )
                VALUES (
                    %(member_id)s, %(organization_logo_url)s,
                    %(institution)s, %(photo_url)s, %(full_name)s
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
                SELECT ap.foto_menteri, ap.logo_kementerian
                FROM anggota a
                JOIN anggota_pemerintah ap ON ap.anggota_id = a.id
                WHERE a.id = %s
                  AND a.jenis_anggota = 'Pemerintah'
                  AND a.status_arsip = FALSE
                """,
                (member_id,),
            )
            old_member = cursor.fetchone()
            if not old_member:
                raise LookupError("Data anggota tidak ditemukan.")

            photo_url = save_profile_photo(
                files.get("photo_file"),
                upload_dir,
            )
            logo_url = save_profile_photo(
                files.get("organization_logo_file"),
                upload_dir,
            )
            values["photo_url"] = photo_url or old_member["foto_menteri"]
            values["organization_logo_url"] = (
                logo_url or old_member["logo_kementerian"]
            )

            if form.get("remove_photo") == "on":
                values["photo_url"] = None
            if form.get("remove_organization_logo") == "on":
                values["organization_logo_url"] = None

            cursor.execute(
                """
                UPDATE anggota
                SET nama_tampilan = %s, instansi_tampilan = %s,
                    position = %s, foto_tampilan = %s,
                    diperbarui_pada = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (
                    values["full_name"],
                    values["institution"],
                    values["position"],
                    values["photo_url"],
                    member_id,
                ),
            )
            cursor.execute(
                """
                UPDATE anggota_pemerintah
                SET logo_kementerian = %s, nama_kementerian = %s,
                    foto_menteri = %s, nama_menteri = %s
                WHERE anggota_id = %s
                """,
                (
                    values["organization_logo_url"],
                    values["institution"],
                    values["photo_url"],
                    values["full_name"],
                    member_id,
                ),
            )

    if photo_url:
        delete_local_profile_photo(old_member["foto_menteri"], upload_dir)
    if logo_url:
        delete_local_profile_photo(
            old_member["logo_kementerian"],
            upload_dir,
        )
