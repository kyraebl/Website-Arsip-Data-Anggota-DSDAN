import os
import re
import sqlite3
from contextlib import contextmanager

from dotenv import load_dotenv


load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_PATH = os.environ.get(
    "DATABASE_PATH",
    os.path.join(BASE_DIR, "dsdan.db"),
)

_NAMED_PARAM = re.compile(r"%\((\w+)\)s")


def _convert(query):
    query = _NAMED_PARAM.sub(r":\1", query)
    return query.replace("%s", "?")


class _Cursor:
    def __init__(self, cursor):
        self._cursor = cursor

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self._cursor.close()

    def execute(self, query, params=None):
        self._cursor.execute(_convert(query), params or ())
        return self

    def fetchone(self):
        row = self._cursor.fetchone()
        return dict(row) if row else None

    def fetchall(self):
        return [dict(row) for row in self._cursor.fetchall()]

    @property
    def lastrowid(self):
        return self._cursor.lastrowid

    @property
    def rowcount(self):
        return self._cursor.rowcount


class _Connection:
    def __init__(self, connection):
        self._connection = connection

    def cursor(self):
        return _Cursor(self._connection.cursor())


@contextmanager
def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    try:
        yield _Connection(connection)
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()