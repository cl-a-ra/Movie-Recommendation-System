import unittest
from unittest.mock import patch

from app import MovieApi


class TrailerTests(unittest.TestCase):
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