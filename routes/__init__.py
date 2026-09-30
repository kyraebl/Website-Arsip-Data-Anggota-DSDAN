from routes.auth import index, login, logout
from routes.members import (
    edit_anggota,
    edit_pemerintah,
    edit_pemerintah_daerah,
    hapus_anggota,
    tambah_anggota,
    tambah_pemerintah,
    tambah_pemerintah_daerah,
)
from routes.pages import anggota, arsip_anggota, dashboard


def register_routes(app):
    app.add_url_rule("/", "index", index, methods=["GET"])
    app.add_url_rule("/login", "login", login, methods=["GET", "POST"])
    app.add_url_rule("/logout", "logout", logout, methods=["POST"])

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
        "/anggota/<int:member_id>/hapus",
        "hapus_anggota",
        hapus_anggota,
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
