import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

database_url = os.environ.get("DATABASE_URL")

if not database_url:
    raise RuntimeError(
        "DATABASE_URL tidak ditemukan di D:/Work/Web Database/.env"
    )

with psycopg.connect(database_url) as connection:
    with connection.cursor() as cursor:
        cursor.execute("SELECT current_database(), version()")
        database_name, version = cursor.fetchone()

        print("Database:", database_name)
        print("PostgreSQL terhubung")
        print(version)