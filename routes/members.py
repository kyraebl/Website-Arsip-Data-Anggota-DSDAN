from flask import current_app, flash, redirect, request, url_for

from routes.auth import login_required
from services.government_members import (
    create_member as create_government_member,
)
from services.government_members import (
    update_member as update_government_member,
)
from services.member_commands import archive_member
from services.non_government_members import (
    create_member as create_non_government_member,
)
from services.non_government_members import (
    update_member as update_non_government_member,
)

from services.regional_government_members import (
    create_member as create_regional_government_member,
)

from services.regional_government_members import (
    update_member as update_regional_government_member,
)

def get_upload_dir():
    return current_app.config["PROFILE_UPLOAD_DIR"]


def redirect_to_members():
    return redirect(url_for("anggota"))


@login_required
def tambah_anggota():
    try:
        create_non_government_member(
            request.form,
            request.files,
            get_upload_dir(),
        )
    except ValueError as error:
        flash(str(error), "error")
        return redirect_to_members()

    flash("Data anggota berhasil ditambahkan.", "success")
    return redirect_to_members()


@login_required
def tambah_pemerintah():
    try:
        create_government_member(
            request.form,
            request.files,
            get_upload_dir(),
        )
    except ValueError as error:
        flash(str(error), "error")
        return redirect_to_members()

    flash("Data anggota pemerintah berhasil ditambahkan.", "success")
    return redirect_to_members()


@login_required
def edit_pemerintah(member_id):
    try:
        update_government_member(
            member_id,
            request.form,
            request.files,
            get_upload_dir(),
        )
    except (LookupError, ValueError) as error:
        flash(str(error), "error")
        return redirect_to_members()

    flash("Data anggota pemerintah berhasil diperbarui.", "success")
    return redirect_to_members()


@login_required
def edit_anggota(member_id):
    try:
        update_non_government_member(
            member_id,
            request.form,
            request.files,
            get_upload_dir(),
        )
    except (LookupError, ValueError) as error:
        flash(str(error), "error")
        return redirect_to_members()

    flash("Data anggota berhasil diperbarui.", "success")
    return redirect_to_members()


@login_required
def hapus_anggota(member_id):
    try:
        archive_member(member_id)
    except LookupError as error:
        flash(str(error), "error")
        return redirect_to_members()

    flash("Data anggota berhasil dipindahkan ke arsip.", "success")
    return redirect_to_members()

@login_required
def tambah_pemerintah_daerah():
    try:
        create_regional_government_member(
            request.form,
            request.files,
            get_upload_dir(),
        )
    except ValueError as error:
        flash(str(error), "error")
        return redirect_to_members()

    flash(
        "Data anggota pemerintah daerah berhasil ditambahkan.",
        "success",
    )
    return redirect_to_members()

@login_required
def edit_pemerintah_daerah(member_id):
    try:
        update_regional_government_member(
            member_id,
            request.form,
            request.files,
            get_upload_dir(),
        )
    except (LookupError, ValueError) as error:
        flash(str(error), "error")
        return redirect_to_members()

    flash(
        "Data anggota pemerintah daerah berhasil diperbarui.",
        "success",
    )
    return redirect_to_members()