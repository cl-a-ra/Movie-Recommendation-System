# MRSmovies

A beginner-friendly desktop movie recommendation system built with Python,
HTML, CSS, and vanilla JavaScript.

## Run the app

1. Install Python 3.10 or newer.
2. Install the dependency:

   ```powershell
   pip install -r requirements.txt
   ```

3. Start the desktop application:

   ```powershell
   python app.py
   ```

## Project files

- `app.py` starts the desktop window and exposes Python methods to JavaScript.
- `movie_data.py` contains the movie catalog.
- `index.html` contains the page structure and styling.
- `app.js` handles filters, dialogs, recommendations, and the watchlist.
- `watchlist.json` is created automatically after the first saved movie.

The recommendation method compares the genres and moods of two movies. More
shared tags produce a higher match score, so the result is easy to understand
and modify while learning.