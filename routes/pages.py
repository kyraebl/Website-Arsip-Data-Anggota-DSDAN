from flask import render_template

from routes.auth import login_required
from services.member_queries import get_member_statistics, get_members


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
            "Database Anggota Dewan Sumber Daya Air Nasional"
        ),
        members=active_members,
        **statistics,
    )


@login_required
def anggota():
    active_members = get_members()

    return render_template(
        "data_anggota.html",
        page_type="members",
        active_page="anggota",
        page_title="Data Anggota",
        page_heading=(
            "Data Anggota Dewan Sumber Daya Air Nasional"
        ),
        members=active_members,
    )


@login_required
def arsip_anggota():
    archived_members = get_members(archived=True)

    return render_template(
        "members.html",
        page_type="archive",
        active_page="arsip",
        page_title="Arsip Anggota",
        page_heading=(
            "Arsip Anggota Dewan Sumber Daya Air Nasional"
        ),
        members=archived_members,
    )
