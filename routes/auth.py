import os
from functools import wraps

from flask import flash, redirect, render_template, session, request, url_for
from werkzeug.security import check_password_hash, generate_password_hash


ADMIN_EMAIL = os.environ.get(
    "ADMIN_EMAIL",
    "admin.dsdanasional@go.id",
)

ADMIN_PASSWORD_HASH = os.environ.get(
    "ADMIN_PASSWORD_HASH",
    generate_password_hash("admin123"),
)


def login_required(view_function):
    @wraps(view_function)
    def wrapped_view(*args, **kwargs):
        if not session.get("admin_authenticated"):
            return redirect(url_for("login"))

        return view_function(*args, **kwargs)

    return wrapped_view


def index():
    if session.get("admin_authenticated"):
        return redirect(url_for("dashboard"))

    return redirect(url_for("login"))


def login():
    if session.get("admin_authenticated"):
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        email_is_valid = email == ADMIN_EMAIL.lower()
        password_is_valid = check_password_hash(
            ADMIN_PASSWORD_HASH,
            password,
        )

        if email_is_valid and password_is_valid:
            session.clear()
            session["admin_authenticated"] = True
            session["admin_email"] = ADMIN_EMAIL

            return redirect(url_for("dashboard"))

        flash("Email atau kata sandi tidak sesuai.", "error")

    return render_template("login.html")


def logout():
    session.clear()
    return redirect(url_for("login"))
