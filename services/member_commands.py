from db import get_connection


def archive_member(member_id):
    query = """
        UPDATE anggota
        SET
            status_arsip = TRUE,
            tanggal_arsip = CURRENT_TIMESTAMP,
            diperbarui_pada = CURRENT_TIMESTAMP
        WHERE id = %s
          AND status_arsip = FALSE
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, (member_id,))

            if cursor.rowcount == 0:
                raise LookupError("Data anggota tidak ditemukan.")


def restore_member(member_id):
    query = """
        UPDATE anggota
        SET
            status_arsip = FALSE,
            tanggal_arsip = NULL,
            diperbarui_pada = CURRENT_TIMESTAMP
        WHERE id = %s
          AND status_arsip = TRUE
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, (member_id,))

            if cursor.rowcount == 0:
                raise LookupError("Data arsip anggota tidak ditemukan.")


def delete_archived_member(member_id):
    select_query = """
        SELECT
            a.foto_tampilan,
            np.foto_organisasi,
            np.foto_perwakilan,
            ap.logo_kementerian,
            ap.foto_menteri,
            ad.logo_daerah,
            ad.foto_gubernur
        FROM anggota a
        LEFT JOIN anggota_non_pemerintah np ON np.anggota_id = a.id
        LEFT JOIN anggota_pemerintah ap ON ap.anggota_id = a.id
        LEFT JOIN anggota_pemerintah_daerah ad ON ad.anggota_id = a.id
        WHERE a.id = %s
          AND a.status_arsip = TRUE
    """
    delete_query = """
        DELETE FROM anggota
        WHERE id = %s
          AND status_arsip = TRUE
    """

    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(select_query, (member_id,))
            archived_member = cursor.fetchone()
            if not archived_member:
                raise LookupError("Data arsip anggota tidak ditemukan.")

            cursor.execute(delete_query, (member_id,))

            if cursor.rowcount == 0:
                raise LookupError("Data arsip anggota tidak ditemukan.")

    return [
        photo_url
        for photo_url in archived_member.values()
        if photo_url
    ]
