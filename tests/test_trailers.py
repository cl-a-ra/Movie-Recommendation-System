import io
import json
import unittest
from unittest.mock import patch

from app import MovieApi
from web_app import web_app


class TrailerTests(unittest.TestCase):
    @patch("web_app.movie_api.get_trailer")
    def test_web_endpoint_forwards_title_and_type(self, get_trailer):
        get_trailer.return_value = {"status": "available", "url": "https://www.youtube.com/watch?v=b9EkMc79ZSU"}
        response = web_app.test_client().get("/api/trailer/imdb-tt4574334?type=Series")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, get_trailer.return_value)
        get_trailer.assert_called_once_with("imdb-tt4574334", "Series")

    @patch("app.urllib.request.urlopen")
    def test_online_trailer_lookup_for_movies_and_series(self, urlopen):
        for movie_id, media_type, category in (
            ("catalog-tt1375666", "Movie", "movie"),
            ("imdb-tt4574334", "Series", "series"),
        ):
            with self.subTest(movie_id=movie_id):
                urlopen.return_value = io.StringIO(json.dumps({"meta": {"trailers": [
                    {"type": "Clip", "source": "5EiV_HXIIGs"},
                    {"type": "Trailer", "source": "invalid"},
                    {"type": "Trailer", "source": "b9EkMc79ZSU"},
                ]}}))
                self.assertEqual(MovieApi().get_trailer(movie_id, media_type), {
                    "status": "available", "url": "https://www.youtube.com/watch?v=b9EkMc79ZSU",
                })
                self.assertIn(f"/meta/{category}/", urlopen.call_args.args[0].full_url)

    @patch("app.urllib.request.urlopen")
    def test_missing_or_malformed_metadata(self, urlopen):
        for payload in (None, {}, {"meta": None}, {"meta": {"trailers": None}},
                        {"meta": {"trailers": [None, {}, {"type": "Trailer", "source": "javascript:bad"}]}}):
            with self.subTest(payload=payload):
                urlopen.return_value = io.StringIO(json.dumps(payload))
                self.assertEqual(MovieApi().get_trailer("catalog-tt1375666")["status"], "unavailable")

    @patch("app.urllib.request.urlopen", side_effect=OSError("offline"))
    def test_provider_failure_is_retryable(self, urlopen):
        self.assertEqual(MovieApi().get_trailer("imdb-tt1375666"), {"status": "error", "url": None})

    @patch("app.urllib.request.urlopen")
    def test_invalid_lookup_does_not_contact_provider(self, urlopen):
        for movie_id, media_type in ((None, "Movie"), ("catalog-../../other", "Movie"),
                                    ("m1", "Movie"), ("imdb-tt1375666", "other")):
            self.assertEqual(MovieApi().get_trailer(movie_id, media_type)["status"], "unavailable")
        urlopen.assert_not_called()

    def test_every_builtin_title_has_a_valid_trailer(self):
        movies = MovieApi().get_movies()
        self.assertTrue(movies)
        for movie in movies:
            with self.subTest(title=movie["title"]):
                self.assertRegex(
                    movie["trailer_url"],
                    r"\Ahttps://www\.youtube\.com/watch\?v=[A-Za-z0-9_-]{11}\Z",
                )

    @patch("app.webbrowser.open")
    def test_opens_trusted_links(self, open_browser):
        for url in (
            "https://www.youtube.com/watch?v=YoHD9XEInc0",
            "https://www.imdb.com/title/tt1375666/",
        ):
            with self.subTest(url=url):
                self.assertTrue(MovieApi().open_url(url))
                open_browser.assert_called_with(url)

    @patch("app.webbrowser.open")
    def test_rejects_untrusted_or_invalid_trailer_links(self, open_browser):
        for url in (
            None,
            "javascript:alert(1)",
            "http://www.youtube.com/watch?v=YoHD9XEInc0",
            "https://www.youtube.com.evil.example/watch?v=YoHD9XEInc0",
            "https://www.youtube.com/redirect?q=https://example.com",
            "https://www.youtube.com/watch?v=short",
            "https://www.youtube.com/watch?v=YoHD9XEInc0&redirect=other",
        ):
            with self.subTest(url=url):
                self.assertFalse(MovieApi().open_url(url))
        open_browser.assert_not_called()


if __name__ == "__main__":
    unittest.main()