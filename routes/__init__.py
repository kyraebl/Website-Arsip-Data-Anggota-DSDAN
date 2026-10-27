from routes.auth import index, login, logout
from routes.members import (
    arsipkan_anggota,
    edit_anggota,
    edit_pemerintah,
    edit_pemerintah_daerah,
    hapus_arsip_anggota,
    kembalikan_anggota,
    tambah_anggota,
    tambah_pemerintah,
    tambah_pemerintah_daerah,
)
# Pastikan direktori_publik sudah diimpor dari routes.pages
from routes.pages import anggota, arsip_anggota, dashboard, direktori_publik


def register_routes(app):
    # 1. Halaman utama (publik) langsung di domain root "/"
    app.add_url_rule("/", "direktori_publik", direktori_publik, methods=["GET"])

    # 2. Pintu masuk admin disembunyikan di "/kelola-sistem"
    app.add_url_rule("/kelola-sistem", "index", index, methods=["GET"])
    app.add_url_rule("/kelola-sistem/login", "login", login, methods=["GET", "POST"])
    app.add_url_rule("/kelola-sistem/logout", "logout", logout, methods=["POST"])

    # 3. Halaman internal admin
    app.add_url_rule(
        "/dashboard",
        "dashboard",
        dashboard,
        methods=["GET"],
    )
    app.add_url_rule("/anggota", "anggota", anggota, methods=["GET"])
    app.add_url_rule(
        "/arsip-anggota",
        "arsip_anggota",
        arsip_anggota,
        methods=["GET"],
    )

    # 4. Proses CRUD (Create, Read, Update, Delete)
    app.add_url_rule(
        "/anggota/tambah",
        "tambah_anggota",
        tambah_anggota,
        methods=["POST"],
    )
    app.add_url_rule(
        "/anggota/tambah-pemerintah",
        "tambah_pemerintah",
        tambah_pemerintah,
        methods=["POST"],
    )
    app.add_url_rule(
        "/anggota/<int:member_id>/edit",
        "edit_anggota",
        edit_anggota,
        methods=["POST"],
    )
    app.add_url_rule(
        "/anggota/<int:member_id>/edit-pemerintah",
        "edit_pemerintah",
        edit_pemerintah,
        methods=["POST"],
    )
    app.add_url_rule(
        "/anggota/<int:member_id>/arsip",
        "arsipkan_anggota",
        arsipkan_anggota,
        methods=["POST"],
    )
    app.add_url_rule(
        "/arsip-anggota/<int:member_id>/kembalikan",
        "kembalikan_anggota",
        kembalikan_anggota,
        methods=["POST"],
    )
    app.add_url_rule(
        "/arsip-anggota/<int:member_id>/hapus",
        "hapus_arsip_anggota",
        hapus_arsip_anggota,
        methods=["POST"],
    )
    app.add_url_rule(
        "/anggota/tambah-pemerintah-daerah",
        "tambah_pemerintah_daerah",
        tambah_pemerintah_daerah,
        methods=["POST"],
    )
    app.add_url_rule(
        "/anggota/<int:member_id>/edit-pemerintah-daerah",
        "edit_pemerintah_daerah",
        edit_pemerintah_daerah,
        methods=["POST"],
    )