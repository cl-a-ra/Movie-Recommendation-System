"""Flask entry point for hosting MRSmovies on the web."""

from flask import Flask, jsonify, request, send_from_directory

from app import BASE_DIR, MovieApi


web_app = Flask(__name__)
movie_api = MovieApi()


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


if __name__ == "__main__":
    web_app.run(debug=True)