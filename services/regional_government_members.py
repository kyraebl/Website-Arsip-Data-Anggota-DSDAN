from db import get_connection
from services.form_helpers import text_value
from services.uploads import save_profile_photo


def get_form_values(form):
    return {
        "institution": text_value(form, "institution"),
        "full_name": text_value(form, "full_name"),
    }


def validate(values):
    if not values["full_name"]:
        raise ValueError("Nama gubernur wajib diisi.")

    if not values["institution"]:
        raise ValueError("Nama daerah atau wilayah wajib diisi.")


def create_member(form, files, upload_dir):
    values = get_form_values(form)

    photo_url = save_profile_photo(
        files.get("photo_file"),
        upload_dir,
    )

    logo_url = save_profile_photo(
        files.get("organization_logo_file"),
        upload_dir,
    )

    values["photo_url"] = photo_url
    values["organization_logo_url"] = logo_url

    validate(values)

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO anggota (
                    jenis_anggota,
                    nama_tampilan,
                    instansi_tampilan,
                    foto_tampilan
                )
                VALUES (
                    'Pemerintah Daerah',
                    %(full_name)s,
                    %(institution)s,
                    %(photo_url)s
                )
                """,
                values,
            )

            member_id = cursor.lastrowid

            cursor.execute(
                """
                INSERT INTO anggota_pemerintah_daerah (
                    anggota_id,
                    logo_daerah,
                    nama_daerah,
                    foto_gubernur,
                    nama_gubernur
                )
                VALUES (
                    %(member_id)s,
                    %(organization_logo_url)s,
                    %(institution)s,
                    %(photo_url)s,
                    %(full_name)s
                )
                """,
                {
                    **values,
                    "member_id": member_id,
                },
            )

def update_member(member_id, form, files, upload_dir):
    values = get_form_values(form)
    validate(values)

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT ad.foto_gubernur, ad.logo_daerah
                FROM anggota a
                JOIN anggota_pemerintah_daerah ad
                    ON ad.anggota_id = a.id
                WHERE a.id = %s
                  AND a.jenis_anggota = 'Pemerintah Daerah'
                  AND a.status_arsip = FALSE
                """,
                (member_id,),
            )

            old_member = cursor.fetchone()

            if not old_member:
                raise LookupError(
                    "Data anggota pemerintah daerah tidak ditemukan."
                )

            photo_url = save_profile_photo(
                files.get("photo_file"),
                upload_dir,
            )

            logo_url = save_profile_photo(
                files.get("organization_logo_file"),
                upload_dir,
            )

            values["photo_url"] = (
                photo_url or old_member["foto_gubernur"]
            )

            values["organization_logo_url"] = (
                logo_url or old_member["logo_daerah"]
            )

            cursor.execute(
                """
                UPDATE anggota
                SET nama_tampilan = %s,
                    instansi_tampilan = %s,
                    foto_tampilan = %s,
                    diperbarui_pada = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (
                    values["full_name"],
                    values["institution"],
                    values["photo_url"],
                    member_id,
                ),
            )

            cursor.execute(
                """
                UPDATE anggota_pemerintah_daerah
                SET logo_daerah = %s,
                    nama_daerah = %s,
                    foto_gubernur = %s,
                    nama_gubernur = %s
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