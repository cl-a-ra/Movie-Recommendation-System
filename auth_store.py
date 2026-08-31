"""SQLite persistence for MRSmovies user accounts and watchlists."""

import sqlite3
from contextlib import closing
from pathlib import Path

from werkzeug.security import check_password_hash, generate_password_hash


class AuthStore:
    """Store users and their saved movie IDs in a small relational database."""

    def __init__(self, database_path):
        self.database_path = Path(database_path)
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def _connect(self):
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def _initialize(self):
        with closing(self._connect()) as connection:
            with connection:
                connection.executescript(
                    """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE IF NOT EXISTS watchlist (
                    user_id INTEGER NOT NULL,
                    movie_id TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (user_id, movie_id),
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
                """
                )

    def create_user(self, name, email, password):
        try:
            with closing(self._connect()) as connection:
                with connection:
                    cursor = connection.execute(
                        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                        (name, email, generate_password_hash(password)),
                    )
                    return {"id": cursor.lastrowid, "name": name, "email": email}
        except sqlite3.IntegrityError:
            return None

    def authenticate(self, email, password):
        with closing(self._connect()) as connection:
            user = connection.execute(
                "SELECT id, name, email, password_hash FROM users WHERE email = ?",
                (email,),
            ).fetchone()

        if user is None or not check_password_hash(user["password_hash"], password):
            return None
        return {"id": user["id"], "name": user["name"], "email": user["email"]}

    def get_user(self, user_id):
        with closing(self._connect()) as connection:
            user = connection.execute(
                "SELECT id, name, email FROM users WHERE id = ?",
                (user_id,),
            ).fetchone()
        return dict(user) if user else None

    def get_watchlist(self, user_id):
        with closing(self._connect()) as connection:
            rows = connection.execute(
                "SELECT movie_id FROM watchlist WHERE user_id = ? ORDER BY created_at",
                (user_id,),
            ).fetchall()
        return [row["movie_id"] for row in rows]

    def toggle_watchlist(self, user_id, movie_id):
        with closing(self._connect()) as connection:
            with connection:
                saved = connection.execute(
                    "SELECT 1 FROM watchlist WHERE user_id = ? AND movie_id = ?",
                    (user_id, movie_id),
                ).fetchone()
                if saved:
                    connection.execute(
                        "DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?",
                        (user_id, movie_id),
                    )
                else:
                    connection.execute(
                        "INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)",
                        (user_id, movie_id),
                    )
        return self.get_watchlist(user_id)