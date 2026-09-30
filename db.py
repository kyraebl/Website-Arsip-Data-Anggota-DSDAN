import os
from contextlib import contextmanager
from urllib.parse import unquote, urlparse

import pymysql
from dotenv import load_dotenv
from pymysql.cursors import DictCursor


load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL belum diset di file .env")

_url = urlparse(DATABASE_URL)


@contextmanager
def get_connection():
    connection = pymysql.connect(
        host=_url.hostname,
        port=_url.port or 3306,
        user=unquote(_url.username or ""),
        password=unquote(_url.password or ""),
        database=_url.path.lstrip("/"),
        charset="utf8mb4",
        cursorclass=DictCursor,
    )

    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()