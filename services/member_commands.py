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
