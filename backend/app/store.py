import os
import sqlite3
from typing import Any, Dict, Optional
from .config import JOBS_DB_PATH


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(JOBS_DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = _connect()
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS jobs (
            id TEXT PRIMARY KEY,
            status TEXT NOT NULL,
            progress INTEGER DEFAULT 0,
            selfie_path TEXT,
            script TEXT,
            video_path TEXT,
            poster_path TEXT,
            error TEXT,
            mode TEXT,
            created_at TEXT DEFAULT (datetime('now')),
            updated_at TEXT DEFAULT (datetime('now'))
        )
        """
    )
    conn.commit()
    conn.close()


def create_job(job_id: str, selfie_path: str, script: str, mode: str) -> None:
    conn = _connect()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO jobs (id, status, progress, selfie_path, script, mode) VALUES (?, 'queued', 0, ?, ?, ?)",
        (job_id, selfie_path, script, mode),
    )
    conn.commit()
    conn.close()


def update_status(job_id: str, status: str, progress: int, **fields: Any) -> None:
    conn = _connect()
    cur = conn.cursor()
    sets = ["status = ?", "progress = ?", "updated_at = datetime('now')"]
    params = [status, progress]
    for k, v in fields.items():
        sets.append(f"{k} = ?")
        params.append(v)
    params.append(job_id)
    cur.execute(f"UPDATE jobs SET {', '.join(sets)} WHERE id = ?", params)
    conn.commit()
    conn.close()


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    conn = _connect()
    cur = conn.cursor()
    cur.execute("SELECT * FROM jobs WHERE id = ?", (job_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)


