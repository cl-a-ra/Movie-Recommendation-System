# MRSmovies

A movie recommendation system built with Python, Flask, PyWebView, HTML, CSS,
and vanilla JavaScript. It runs as a desktop application or a hosted website.

## Run the app

1. Install Python 3.10 or newer.
2. Install the dependency:

   ```powershell
   pip install -r requirements-desktop.txt
   ```

3. Start the desktop application:

   ```powershell
   python app.py
   ```

## Run the website locally

```powershell
python -m flask --app web_app:web_app run
```

Open `http://127.0.0.1:5000` in a browser. The hosted version keeps each
visitor's watchlist in browser storage while recommendations and MRS Chat Bot
run through the Python API.

## Deploy to Render

1. Push this repository to GitHub.
2. In Render, select **New > Blueprint**.
3. Connect this repository and apply the included `render.yaml` blueprint.

Render installs the Python dependencies and starts the Flask application with
Gunicorn. Free services may pause after a period without traffic.

## Deploy to Vercel

1. Import this GitHub repository in Vercel.
2. Keep the framework preset as **Other** and deploy with the default settings.

The included `vercel.json` routes the website and API requests to the Python
serverless function in `api/index.py`.

## Project files

- `app.py` starts the desktop window and exposes Python methods to JavaScript.
- `web_app.py` exposes the same Python methods as HTTP endpoints for hosting.
- `render.yaml` defines the Render web service.
- `api/index.py` and `vercel.json` configure Vercel serverless hosting.
- `movie_data.py` contains the movie catalog.
- `index.html` contains the page structure and styling.
- `app.js` handles filters, dialogs, recommendations, and the watchlist.
- `watchlist.json` is created automatically after the first saved movie.

The recommendation method compares the genres and moods of two movies. More
shared tags produce a higher match score, so the result is easy to understand
and modify while learning.