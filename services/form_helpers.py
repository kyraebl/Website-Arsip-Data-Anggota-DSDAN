from urllib.parse import urlparse


def normalize_optional_url(value):
    value = value.strip()

    if not value:
        return None

    parsed_url = urlparse(value)

    if parsed_url.scheme not in {"http", "https"}:
        raise ValueError("URL harus menggunakan http atau https.")

    if not parsed_url.netloc:
        raise ValueError("URL tidak valid.")

    return value


def text_value(form, field_name):
    value = form.get(field_name, "").strip()
    return value or None


def integer_value(form, field_name):
    value = form.get(field_name, "").strip()

    if not value:
        return None

    try:
        return int(value)
    except ValueError as error:
        raise ValueError(
            f"{field_name} harus berupa angka."
        ) from error
