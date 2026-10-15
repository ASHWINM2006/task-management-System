"""
seed_db.py – Load seed_data.sql into the SQLite database.
Usage (from backend/ with venv active):
    python seed_db.py
"""
import os, sqlite3

BASE = os.path.dirname(os.path.abspath(__file__))
DB   = os.path.join(BASE, "tasks.db")
SQL  = os.path.join(BASE, "seed_data.sql")

if not os.path.exists(DB):
    print(f"[ERROR] {DB} not found. Run 'alembic upgrade head' first.")
    raise SystemExit(1)

conn = sqlite3.connect(DB)
conn.executescript(open(SQL, encoding="utf-8").read())
conn.commit()
conn.close()
cur = sqlite3.connect(DB).execute("SELECT COUNT(*) FROM tasks")
print(f"[OK] Seed complete – {cur.fetchone()[0]} tasks in database.")
