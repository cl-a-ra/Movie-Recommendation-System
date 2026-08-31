"""Flask entry point for hosting MRSmovies on the web."""

import os
import re
import secrets
import tempfile
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory, session

from app import BASE_DIR, MovieApi
from auth_store import AuthStore


web_app = Flask(__name__)
web_app.config.update(
    SECRET_KEY=os.environ.get("MRS_SECRET_KEY") or secrets.token_hex(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("VERCEL") == "1",
)
movie_api = MovieApi()
database_path = os.environ.get("MRS_DATABASE_PATH")
if not database_path:
    database_path = Path(tempfile.gettempdir()) / "mrsmovies.db" if os.environ.get("VERCEL") else BASE_DIR / "mrsmovies.db"
auth_store = AuthStore(database_path)


def current_user():
    """Return the signed-in user represented by the secure session cookie."""
    user_id = session.get("user_id")
    return auth_store.get_user(user_id) if user_id else None


def authentication_required():
    return jsonify({"error": "Sign in to use your account watchlist."}), 401


def clean_email(value):
    return str(value or "").strip().casefold()


@web_app.get("/")
def index():
    """Serve the same interface used by the PyWebView desktop window."""
    return send_from_directory(BASE_DIR, "index.html")


@web_app.get("/app.js")
def javascript():
    """Serve the browser application code."""
    return send_from_directory(BASE_DIR, "app.js")


@web_app.get("/assets/<path:filename>")
def assets(filename):
    """Serve optional local images and other static assets."""
    return send_from_directory(BASE_DIR / "assets", filename)


@web_app.get("/api/movies")
def movies():
    return jsonify(movie_api.get_movies())


@web_app.get("/api/discover")
def discover():
    return jsonify(movie_api.discover_movies(request.args.get("skip", 0)))


@web_app.get("/api/search")
def search():
    return jsonify(movie_api.search_movies(request.args.get("q", "")))


@web_app.get("/api/recommend/<movie_id>")
def recommend(movie_id):
    return jsonify(movie_api.recommend(movie_id))


@web_app.post("/api/chat")
def chat():
    body = request.get_json(silent=True) or {}
    return jsonify(movie_api.chat(body.get("message", "")))


@web_app.get("/api/auth/session")
def auth_session():
    return jsonify({"user": current_user()})


@web_app.post("/api/auth/signup")
def signup():
    body = request.get_json(silent=True) or {}
    name = " ".join(str(body.get("name", "")).strip().split())
    email = clean_email(body.get("email"))
    password = str(body.get("password", ""))

    if len(name) < 2 or len(name) > 60:
        return jsonify({"error": "Enter a name between 2 and 60 characters."}), 400
    if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+", email) or len(email) > 254:
        return jsonify({"error": "Enter a valid email address."}), 400
    if len(password) < 8 or len(password) > 128:
        return jsonify({"error": "Use a password between 8 and 128 characters."}), 400

    user = auth_store.create_user(name, email, password)
    if user is None:
        return jsonify({"error": "An account with that email already exists."}), 409

    session.clear()
    session["user_id"] = user["id"]
    return jsonify({"user": user}), 201


@web_app.post("/api/auth/login")
def login():
    body = request.get_json(silent=True) or {}
    user = auth_store.authenticate(
        clean_email(body.get("email")),
        str(body.get("password", "")),
    )
    if user is None:
        return jsonify({"error": "Email or password is incorrect."}), 401

    session.clear()
    session["user_id"] = user["id"]
    return jsonify({"user": user})


@web_app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify({"user": None})


@web_app.get("/api/watchlist")
def account_watchlist():
    user = current_user()
    if user is None:
        return authentication_required()
    return jsonify(auth_store.get_watchlist(user["id"]))


@web_app.post("/api/watchlist/<movie_id>")
def toggle_account_watchlist(movie_id):
    user = current_user()
    if user is None:
        return authentication_required()
    if not re.fullmatch(r"[A-Za-z0-9_-]{1,80}", movie_id):
        return jsonify({"error": "Invalid movie ID."}), 400
    return jsonify(auth_store.toggle_watchlist(user["id"], movie_id))


@web_app.get("/api/recommendations/personalized")
def personalized_recommendations():
    user = current_user()
    if user is None:
        return authentication_required()
    watchlist = auth_store.get_watchlist(user["id"])
    return jsonify(movie_api.recommend_for(watchlist))


if __name__ == "__main__":
    web_app.run(debug=True)