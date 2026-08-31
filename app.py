"""MRSmovies desktop application.

Python owns the data and recommendation logic. HTML and JavaScript own the
interface shown inside the PyWebView desktop window.
"""

import json
import re
import urllib.error
import urllib.parse
import urllib.request
import webbrowser
from pathlib import Path

from movie_data import MOVIES


BASE_DIR = Path(__file__).resolve().parent
WATCHLIST_FILE = BASE_DIR / "watchlist.json"


class MovieApi:
    """Backend methods exposed to JavaScript through the PyWebView bridge."""

    # Words that do not help identify a genre, mood, title, or theme.
    CHAT_STOP_WORDS = {
        "a", "about", "an", "and", "are", "can", "for", "i", "in", "is",
        "it", "me", "movie", "movies", "of", "on", "please", "recommend",
        "show", "something", "that", "the", "to", "want", "watch", "with",
    }
    # Translate everyday language into the vocabulary used by the movie data.
    CHAT_ALIASES = {
        "clever": "mind-bending",
        "exciting": "action",
        "fun": "comedy",
        "funny": "comedy",
        "romantic": "romance",
        "sad": "emotional",
        "scary": "horror",
        "space": "sci-fi",
    }

    def get_movies(self):
        """Return the built-in catalog used for filters and recommendations."""
        return MOVIES

    def discover_movies(self, skip=0):
        """Return the next page of movies from Cinemeta's public catalog."""
        safe_skip = max(0, int(skip))
        url = f"https://v3-cinemeta.strem.io/catalog/movie/top/skip={safe_skip}.json"
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

        try:
            with urllib.request.urlopen(request, timeout=12) as response:
                results = json.load(response).get("metas", [])
        except (OSError, urllib.error.URLError, json.JSONDecodeError, ValueError):
            return []

        movies = []
        fallback_image = MOVIES[0]["poster"]
        for item in results:
            imdb_id = item.get("imdb_id") or item.get("id", "")
            if not imdb_id:
                continue

            try:
                rating = float(item.get("imdbRating") or 0)
            except (TypeError, ValueError):
                rating = 0

            year_text = str(item.get("year") or item.get("releaseInfo") or "Unknown")
            year = int(year_text[:4]) if year_text[:4].isdigit() else "Unknown"
            directors = item.get("director") or []
            if isinstance(directors, str):
                directors = [directors]

            movies.append({
                "id": f"catalog-{imdb_id}",
                "title": item.get("name", "Unknown title"),
                "type": "Movie",
                "year": year,
                "rating": rating,
                "genres": item.get("genres") or item.get("genre") or ["Movie"],
                "moods": [],
                "director": ", ".join(directors) or "Director unavailable",
                "duration": item.get("runtime") or "Runtime unavailable",
                "overview": item.get("description") or "Description unavailable.",
                "poster": item.get("poster") or fallback_image,
                "backdrop": item.get("background") or item.get("poster") or fallback_image,
                "streaming": ["Availability varies by region"],
                "source": "catalog",
                "external_url": f"https://www.imdb.com/title/{imdb_id}/",
            })

        return movies

    def search_movies(self, query):
        """Search IMDb's public suggestion catalog without an API key."""
        clean_query = query.strip()
        if not clean_query:
            return []

        encoded_query = urllib.parse.quote(clean_query.lower(), safe="")
        url = f"https://v2.sg.media-imdb.com/suggestion/x/{encoded_query}.json"
        request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                results = json.load(response).get("d", [])
        except (OSError, urllib.error.URLError, json.JSONDecodeError):
            return []

        movies = []
        allowed_types = {"movie", "tvMovie", "tvSeries", "tvMiniSeries"}
        fallback_image = MOVIES[0]["poster"]

        for item in results:
            if item.get("qid") not in allowed_types or not item.get("id"):
                continue

            image = item.get("i", {}).get("imageUrl", fallback_image)
            item_type = "Series" if item.get("qid", "").startswith("tv") and item.get("qid") != "tvMovie" else "Movie"
            cast = item.get("s", "Cast information unavailable")
            movies.append({
                "id": f"imdb-{item['id']}",
                "title": item.get("l", "Unknown title"),
                "type": item_type,
                "year": item.get("y", "Unknown"),
                "rating": 0,
                "genres": [item_type],
                "moods": [],
                "director": cast,
                "duration": "Runtime unavailable",
                "overview": f"Online IMDb result featuring {cast}.",
                "poster": image,
                "backdrop": image,
                "streaming": ["Availability varies by region"],
                "source": "imdb",
                "external_url": f"https://www.imdb.com/title/{item['id']}/",
            })

        return movies

    def open_url(self, url):
        """Open only trusted IMDb title links in the system browser."""
        if url.startswith("https://www.imdb.com/title/"):
            webbrowser.open(url)
            return True
        return False

    def get_watchlist(self):
        """Load saved movie IDs, returning an empty list for missing/bad data."""
        if not WATCHLIST_FILE.exists():
            return []

        try:
            return json.loads(WATCHLIST_FILE.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            return []

    def toggle_watchlist(self, movie_id):
        """Add or remove one movie ID and persist the updated watchlist."""
        watchlist = self.get_watchlist()

        if movie_id in watchlist:
            watchlist.remove(movie_id)
        else:
            watchlist.append(movie_id)

        WATCHLIST_FILE.write_text(json.dumps(watchlist, indent=2), encoding="utf-8")
        return watchlist

    def recommend(self, movie_id):
        """Rank local movies by shared genres, moods, and rating."""
        selected = next((movie for movie in MOVIES if movie["id"] == movie_id), None)
        if selected is None:
            return []

        selected_tags = set(selected["genres"] + selected["moods"])
        scored_movies = []

        for movie in MOVIES:
            if movie["id"] == movie_id:
                continue

            movie_tags = set(movie["genres"] + movie["moods"])
            shared_tags = selected_tags.intersection(movie_tags)
            score = len(shared_tags) * 20 + movie["rating"]
            result = dict(movie)
            result["match_score"] = min(99, round(score))
            result["reason"] = "Shared: " + ", ".join(sorted(shared_tags))
            scored_movies.append(result)

        scored_movies.sort(key=lambda movie: movie["match_score"], reverse=True)
        return scored_movies[:5]

    def chat(self, message):
        """Answer natural-language movie questions using the local catalog."""
        # Normalize whitespace and casing so matching behaves consistently.
        clean_message = " ".join(str(message).strip().split())
        if not clean_message:
            return {"message": "Tell me what you feel like watching.", "movie_ids": []}

        normalized = clean_message.casefold()
        if re.search(r"\b(hello|hey|hi)\b", normalized):
            return {
                "message": "Hi, I'm MRS Chat Bot! Tell me a genre, mood, or movie you already enjoy, and I'll find a match.",
                "movie_ids": [],
            }

        # "Movies like..." requests reuse the main genre-and-mood recommender.
        mentioned_movie = next(
            (movie for movie in MOVIES if movie["title"].casefold() in normalized),
            None,
        )
        if mentioned_movie and re.search(r"\b(like|similar|another|more)\b", normalized):
            matches = self.recommend(mentioned_movie["id"])[:3]
            titles = ", ".join(movie["title"] for movie in matches)
            return {
                "message": f"Because you liked {mentioned_movie['title']}, try {titles}. They share its strongest genres and moods.",
                "movie_ids": [movie["id"] for movie in matches],
            }

        # Restrict results when the user explicitly asks for a movie or series.
        requested_type = None
        if re.search(r"\b(series|show|shows|tv)\b", normalized):
            requested_type = "Series"
        elif re.search(r"\b(film|films|movie|movies)\b", normalized):
            requested_type = "Movie"

        # Remove filler words and translate common phrases into catalog tags.
        query_words = {
            word for word in re.findall(r"[a-z0-9]+", normalized)
            if len(word) > 2 and word not in self.CHAT_STOP_WORDS
        }
        query_words.update(
            alias for word, alias in self.CHAT_ALIASES.items() if word in query_words
        )
        # Exact genre/mood matches carry more weight than general text matches.
        ranked_movies = []
        for movie in MOVIES:
            if requested_type and movie["type"] != requested_type:
                continue

            tags = movie["genres"] + movie["moods"]
            searchable = " ".join([
                movie["title"], movie["director"], movie["overview"], *tags,
            ]).casefold()
            exact_tags = [tag for tag in tags if tag.casefold() in normalized]
            word_matches = sum(word in searchable for word in query_words)
            score = len(exact_tags) * 12 + word_matches * 3 + movie["rating"] / 10
            if score > 1:
                ranked_movies.append((score, movie, exact_tags))

        ranked_movies.sort(key=lambda item: item[0], reverse=True)
        matches = ranked_movies[:3]
        if not matches:
            return {
                "message": "I couldn't find a close catalog match. Try a mood like emotional or mind-bending, a genre like comedy, or say 'movies like Inception'.",
                "movie_ids": [],
            }

        # Return IDs separately so JavaScript can build clickable movie cards.
        titles = ", ".join(movie["title"] for _, movie, _ in matches)
        matched_tags = sorted({tag for _, _, tags in matches for tag in tags})
        reason = f" for {', '.join(matched_tags)}" if matched_tags else " based on your request"
        return {
            "message": f"I'd pick {titles}{reason}. Open a suggestion below to see its details.",
            "movie_ids": [movie["id"] for _, movie, _ in matches],
        }


def main():
    """Create the desktop window and connect its JavaScript API to MovieApi."""
    try:
        import webview
    except ImportError:
        print("PyWebView is not installed. Run: pip install -r requirements.txt")
        return

    page = (BASE_DIR / "index.html").as_uri()
    webview.create_window(
        "MRSmovies - Movie Recommendation System",
        page,
        js_api=MovieApi(),
        width=1280,
        height=820,
        min_size=(320, 520),
    )
    webview.start()


if __name__ == "__main__":
    main()