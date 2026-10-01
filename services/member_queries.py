from db import get_connection
from datetime import datetime, timedelta


MEMBER_SELECT = """
    SELECT
        a.id,
        a.jenis_anggota AS category,
        a.instansi_tampilan AS institution,
        a.position,
        a.nama_tampilan AS name,
        np.nik AS identity_number,
        np.periode_penugasan AS assignment_period,
        np.telepon AS phone,
        np.email,
        np.alamat AS address,
        np.nama_organisasi AS organization_name,
        np.alamat_organisasi AS organization_address,
        np.nama_ketua_organisasi AS organization_chair_name,
        np.periode_jabatan_ketua AS organization_chair_period,
        np.jumlah_anggota AS organization_member_count,
        np.telepon_organisasi AS organization_contact_phone,
        np.email_organisasi AS organization_email,
        COALESCE(np.foto_perwakilan, ap.foto_menteri, ad.foto_gubernur,
                 a.foto_tampilan) AS photo_url,
        COALESCE(np.foto_organisasi, ap.logo_kementerian, ad.logo_daerah)
            AS organization_logo_url,
        np.surat_penunjukan_url AS appointment_letter_url,
        ad.nama_daerah AS regional_name,
        ad.nama_gubernur AS governor_name,
        ad.foto_gubernur AS governor_photo_url,
        ad.logo_daerah AS regional_logo_url,
        np.surat_pernyataan_url AS statement_letter_url,
        a.status_arsip AS is_archived,
        a.tanggal_arsip AS archived_at
    FROM anggota a
    LEFT JOIN anggota_non_pemerintah np ON np.anggota_id = a.id
    LEFT JOIN anggota_pemerintah ap ON ap.anggota_id = a.id
    LEFT JOIN anggota_pemerintah_daerah ad ON ad.anggota_id = a.id
    WHERE a.status_arsip = %s
    ORDER BY a.nama_tampilan ASC
"""

def _parse_datetime(value):
    if isinstance(value, str):
        try:
            return datetime.fromisoformat(value) + timedelta(hours=7)
        except ValueError:
            return None
    return value

def get_members(archived=False):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(MEMBER_SELECT, (archived,))
            members = cursor.fetchall()

    for member in members:
        member["archived_at"] = _parse_datetime(member["archived_at"])

    return members


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
