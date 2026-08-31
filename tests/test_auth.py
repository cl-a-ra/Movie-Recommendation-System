import tempfile
import unittest
from pathlib import Path

import web_app
from auth_store import AuthStore


class AuthenticationTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        web_app.web_app.config.update(
            TESTING=True,
            SECRET_KEY="test-secret",
            SESSION_COOKIE_SECURE=False,
        )
        web_app.auth_store = AuthStore(Path(self.temporary_directory.name) / "test.db")

    def tearDown(self):
        self.temporary_directory.cleanup()

    def signup(self, client, email="user@example.com"):
        return client.post(
            "/api/auth/signup",
            json={"name": "Test User", "email": email, "password": "strongpass1"},
        )

    def test_account_lifecycle_preserves_watchlist(self):
        client = web_app.web_app.test_client()

        self.assertEqual(self.signup(client).status_code, 201)
        self.assertEqual(client.post("/api/watchlist/m1").json, ["m1"])
        self.assertEqual(client.post("/api/auth/logout").status_code, 200)
        self.assertEqual(client.get("/api/watchlist").status_code, 401)
        self.assertEqual(
            client.post(
                "/api/auth/login",
                json={"email": "user@example.com", "password": "strongpass1"},
            ).status_code,
            200,
        )
        self.assertEqual(client.get("/api/watchlist").json, ["m1"])

    def test_accounts_have_separate_watchlists(self):
        first = web_app.web_app.test_client()
        second = web_app.web_app.test_client()

        self.signup(first, "first@example.com")
        self.signup(second, "second@example.com")
        first.post("/api/watchlist/m2")

        self.assertEqual(second.get("/api/watchlist").json, [])

    def test_watchlist_drives_personalized_recommendations(self):
        client = web_app.web_app.test_client()
        self.signup(client)
        client.post("/api/watchlist/m1")

        response = client.get("/api/recommendations/personalized")

        self.assertEqual(response.status_code, 200)
        self.assertNotIn("m1", [movie["id"] for movie in response.json])
        self.assertTrue(response.json)
        self.assertTrue(response.json[0]["reason"].startswith("From your watchlist:"))

    def test_rejects_invalid_and_duplicate_accounts(self):
        client = web_app.web_app.test_client()

        self.assertEqual(
            client.post(
                "/api/auth/signup",
                json={"name": "A", "email": "bad", "password": "short"},
            ).status_code,
            400,
        )
        self.assertEqual(self.signup(client).status_code, 201)
        self.assertEqual(self.signup(client).status_code, 409)
        self.assertEqual(
            client.post(
                "/api/auth/login",
                json={"email": "user@example.com", "password": "wrongpass"},
            ).status_code,
            401,
        )


if __name__ == "__main__":
    unittest.main()