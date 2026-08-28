const state = {
  movies: [],
  discoverMovies: [],
  discoverSkip: 0,
  isLoadingDiscover: false,
  hasMoreDiscover: true,
  currentPage: 1,
  pageSize: 16,
  watchlist: [],
  view: "discover",
  recommendations: [],
  onlineMovies: [],
  isSearchingOnline: false,
  selectedMovie: null,
};

const elements = {
  search: document.querySelector("#searchInput"),
  searchForm: document.querySelector("#searchForm"),
  type: document.querySelector("#typeFilter"),
  genre: document.querySelector("#genreFilter"),
  mood: document.querySelector("#moodFilter"),
  sort: document.querySelector("#sortFilter"),
  grid: document.querySelector("#movieGrid"),
  empty: document.querySelector("#emptyState"),
  emptyMessage: document.querySelector("#emptyMessage"),
  count: document.querySelector("#resultCount"),
  title: document.querySelector("#sectionTitle"),
  subtitle: document.querySelector("#sectionSubtitle"),
  watchlistCount: document.querySelector("#watchlistCount"),
  recommendationPanel: document.querySelector("#recommendationPanel"),
  filterPanel: document.querySelector("#filterPanel"),
  favoriteMovie: document.querySelector("#favoriteMovie"),
  dialog: document.querySelector("#movieDialog"),
  toast: document.querySelector("#toast"),
  themeToggle: document.querySelector("#themeToggle"),
  pagination: document.querySelector("#pagination"),
};

function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.innerHTML = isDark ? "&#9788;" : "&#9790;";
  elements.themeToggle.setAttribute("aria-label", isDark ? "Enable light mode" : "Enable dark mode");
  elements.themeToggle.title = isDark ? "Enable light mode" : "Enable dark mode";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("mrsmovies_theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  setTheme(savedTheme || systemTheme);
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("mrsmovies_theme", nextTheme);
  setTheme(nextTheme);
}

loadTheme();
document.querySelector("#footerYear").textContent = new Date().getFullYear();

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fillSelect(select, values) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.add("hidden"), 2200);
}

function allKnownMovies() {
  return [...state.movies, ...state.discoverMovies, ...state.onlineMovies].filter(
    (movie, index, movies) => movies.findIndex((item) => item.id === movie.id) === index,
  );
}

function currentMovies() {
  if (state.view === "watchlist") {
    return allKnownMovies().filter((movie) => state.watchlist.includes(movie.id));
  }

  if (state.view === "recommended" && state.recommendations.length) {
    return state.recommendations;
  }

  const query = elements.search.value.trim().toLowerCase();
  const catalog = allKnownMovies().filter(
    (movie, index, movies) => movies.findIndex((item) => item.title.toLowerCase() === movie.title.toLowerCase() && item.year === movie.year) === index,
  );
  const filtered = catalog.filter((movie) => {
    const searchable = [movie.title, movie.director, ...movie.genres, ...movie.moods].join(" ").toLowerCase();
    return (!query || searchable.includes(query))
      && (elements.type.value === "All" || movie.type === elements.type.value)
      && (elements.genre.value === "All" || movie.genres.includes(elements.genre.value))
      && (elements.mood.value === "All" || movie.moods.includes(elements.mood.value));
  });

  const sortedMovies = filtered.sort((first, second) => {
    if (elements.sort.value === "rating") return second.rating - first.rating;
    if (elements.sort.value === "year") return second.year - first.year;
    return second.rating - first.rating;
  });

  if (state.view === "discover" && !query) {
    const pageStart = (state.currentPage - 1) * state.pageSize;
    return sortedMovies.slice(pageStart, pageStart + state.pageSize);
  }

  return sortedMovies;
}

function movieCard(movie, index) {
  const saved = state.watchlist.includes(movie.id);
  const match = movie.match_score ? `<span class="match">${movie.match_score}% match | ${escapeHtml(movie.reason)}</span>` : "";
  const rating = movie.rating ? `&#9733; ${movie.rating.toFixed(1)}` : "IMDb";
  const secondaryAction = movie.source === "imdb"
    ? `<button class="secondary" data-open="${escapeHtml(movie.external_url)}">IMDb</button>`
    : `<button class="secondary ${saved ? "saved" : ""}" data-watchlist="${movie.id}">${saved ? "Saved" : "Add"}</button>`;

  return `
    <article class="movie-card" style="animation-delay: ${Math.min(index * 45, 300)}ms">
      <button class="poster-button" data-details="${movie.id}" aria-label="View ${escapeHtml(movie.title)} details">
        <img class="poster" src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)} poster">
      </button>
      <div class="card-body">
        <div class="card-top">
          <h3 class="card-title">${escapeHtml(movie.title)}</h3>
          <span class="rating">${rating}</span>
        </div>
        <p class="meta">${movie.year} | ${escapeHtml(movie.type)} | ${escapeHtml(movie.duration)}</p>
        <div class="tags">${escapeHtml(movie.genres.slice(0, 2).join(" / "))}${match}</div>
        <div class="card-actions">
          <button class="secondary" data-details="${movie.id}">Details</button>
          ${secondaryAction}
        </div>
      </div>
    </article>`;
}

function render() {
  const movies = currentMovies();
  const query = elements.search.value.trim();
  elements.grid.innerHTML = movies.map(movieCard).join("");
  elements.grid.classList.toggle("hidden", movies.length === 0);
  elements.empty.classList.toggle("hidden", movies.length !== 0);
  elements.count.textContent = `${movies.length} title${movies.length === 1 ? "" : "s"}`;
  elements.watchlistCount.textContent = state.watchlist.length;
  renderPagination(query);
  elements.emptyMessage.textContent = query
    ? `No catalog results for "${query}". Try another title, director, genre, or mood.`
    : "Try changing your search or filters.";

  if (state.view === "watchlist") {
    elements.title.textContent = "Your watchlist";
    elements.subtitle.textContent = "Movies and series you saved for later.";
  } else if (state.view === "recommended") {
    elements.title.textContent = "Your closest matches";
    elements.subtitle.textContent = "Ranked by the Python recommendation engine.";
  } else {
    elements.title.textContent = query ? `Search results for "${query}"` : "Recommended for you";
    elements.subtitle.textContent = state.isSearchingOnline
      ? "Searching the online movie catalog..."
      : query ? "Matching local and online titles." : "Browse the complete catalog.";
  }
}

function renderPagination(query) {
  const shouldShow = state.view === "discover" && !query;
  elements.pagination.classList.toggle("hidden", !shouldShow);
  if (!shouldShow) return;

  const groupStart = Math.floor((state.currentPage - 1) / 4) * 4 + 1;
  const pageButtons = [];
  if (groupStart > 1) {
    pageButtons.push(`<button data-page="${groupStart - 1}" ${state.isLoadingDiscover ? "disabled" : ""}>Previous</button>`);
  }

  for (let page = groupStart; page < groupStart + 4; page += 1) {
    const active = page === state.currentPage ? "active" : "";
    pageButtons.push(`<button class="${active}" data-page="${page}" ${state.isLoadingDiscover ? "disabled" : ""}>${page}</button>`);
  }

  pageButtons.push(`<button data-page="${groupStart + 4}" ${state.isLoadingDiscover ? "disabled" : ""}>Next</button>`);
  if (state.isLoadingDiscover) pageButtons.push('<span class="page-loading">Loading movies...</span>');
  elements.pagination.innerHTML = pageButtons.join("");
}

function showMovie(movieId) {
  const movie = allKnownMovies().find((item) => item.id === movieId);
  if (!movie) return;

  state.selectedMovie = movie;
  document.querySelector("#dialogImage").src = movie.backdrop;
  document.querySelector("#dialogImage").alt = `${movie.title} backdrop`;
  document.querySelector("#dialogType").textContent = `${movie.type} | ${movie.year}`;
  document.querySelector("#dialogTitle").textContent = movie.title;
  document.querySelector("#dialogRating").textContent = movie.rating ? `${movie.rating.toFixed(1)} / 10` : "See IMDb";
  document.querySelector("#dialogDirector").textContent = movie.director;
  document.querySelector("#dialogDuration").textContent = movie.duration;
  document.querySelector("#dialogOverview").textContent = movie.overview;
  document.querySelector("#dialogGenres").textContent = movie.genres.join(", ");
  document.querySelector("#dialogStreaming").textContent = movie.streaming.join(", ");
  updateDialogButton();
  elements.dialog.showModal();
}

function updateDialogButton() {
  const button = document.querySelector("#dialogWatchlist");
  if (state.selectedMovie?.source === "imdb") {
    button.textContent = "View on IMDb";
    return;
  }
  const saved = state.selectedMovie && state.watchlist.includes(state.selectedMovie.id);
  button.textContent = saved ? "Remove from watchlist" : "Add to watchlist";
}

async function toggleWatchlist(movieId) {
  state.watchlist = await window.pywebview.api.toggle_watchlist(movieId);
  updateDialogButton();
  render();
  showToast(state.watchlist.includes(movieId) ? "Added to your watchlist" : "Removed from your watchlist");
}

async function makeRecommendations() {
  const movieId = elements.favoriteMovie.value;
  state.recommendations = await window.pywebview.api.recommend(movieId);
  render();
}

async function loadMoreDiscover() {
  if (state.isLoadingDiscover || !state.hasMoreDiscover) return false;

  state.isLoadingDiscover = true;
  render();
  const nextMovies = await window.pywebview.api.discover_movies(state.discoverSkip);
  state.isLoadingDiscover = false;

  if (!nextMovies.length) {
    state.hasMoreDiscover = false;
    showToast("No more movies could be loaded. Check your internet connection.");
    render();
    return false;
  }

  const knownIds = new Set(allKnownMovies().map((movie) => movie.id));
  state.discoverMovies.push(...nextMovies.filter((movie) => !knownIds.has(movie.id)));
  state.discoverSkip += nextMovies.length;
  render();
  return true;
}

async function goToPage(page) {
  if (state.isLoadingDiscover || page < 1) return;

  const neededMovies = page * state.pageSize;
  while (allKnownMovies().length < neededMovies && state.hasMoreDiscover) {
    const loaded = await loadMoreDiscover();
    if (!loaded) break;
  }

  state.currentPage = page;
  render();
  document.querySelector(".section-heading").scrollIntoView({ behavior: "smooth", block: "start" });
}

function changeView(view) {
  state.view = view;
  document.querySelectorAll(".nav button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  elements.recommendationPanel.classList.toggle("hidden", view !== "recommended");
  elements.filterPanel.classList.toggle("hidden", view !== "discover");
  document.querySelector("#hero").classList.toggle("hidden", view !== "discover");
  render();
}

function attachEvents() {
  elements.search.addEventListener("input", () => {
    state.onlineMovies = [];
    state.currentPage = 1;
    render();
  });
  [elements.type, elements.genre, elements.mood, elements.sort].forEach((control) => control.addEventListener("input", () => {
    state.currentPage = 1;
    render();
  }));
  elements.searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    changeView("discover");
    const query = elements.search.value.trim();
    if (!query) return;
    state.isSearchingOnline = true;
    render();
    state.onlineMovies = await window.pywebview.api.search_movies(query);
    state.isSearchingOnline = false;
    render();
    if (!state.onlineMovies.length) showToast("No online results found. Check your connection or try another title.");
  });
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.pagination.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) goToPage(Number(pageButton.dataset.page));
  });
  document.querySelector("#resetFilters").addEventListener("click", () => {
    elements.search.value = "";
    elements.type.value = "All";
    elements.genre.value = "All";
    elements.mood.value = "All";
    elements.sort.value = "match";
    state.currentPage = 1;
    render();
  });

  document.querySelectorAll(".nav button[data-view]").forEach((button) => button.addEventListener("click", () => changeView(button.dataset.view)));
  document.querySelector("#heroDetails").addEventListener("click", () => showMovie(state.movies[0].id));
  document.querySelector("#recommendButton").addEventListener("click", makeRecommendations);
  document.querySelector("#closeDialog").addEventListener("click", () => elements.dialog.close());
  document.querySelector("#dialogWatchlist").addEventListener("click", () => {
    if (state.selectedMovie.source === "imdb") {
      window.pywebview.api.open_url(state.selectedMovie.external_url);
    } else {
      toggleWatchlist(state.selectedMovie.id);
    }
  });

  elements.grid.addEventListener("click", (event) => {
    const details = event.target.closest("[data-details]");
    const watchlist = event.target.closest("[data-watchlist]");
    const externalLink = event.target.closest("[data-open]");
    if (details) showMovie(details.dataset.details);
    if (watchlist) toggleWatchlist(watchlist.dataset.watchlist);
    if (externalLink) window.pywebview.api.open_url(externalLink.dataset.open);
  });

}

async function startApp() {
  state.movies = await window.pywebview.api.get_movies();
  state.watchlist = await window.pywebview.api.get_watchlist();

  const genres = [...new Set(state.movies.flatMap((movie) => movie.genres))].sort();
  const moods = [...new Set(state.movies.flatMap((movie) => movie.moods))].sort();
  fillSelect(elements.genre, genres);
  fillSelect(elements.mood, moods);
  fillSelect(elements.favoriteMovie, state.movies.map((movie) => movie.title));
  [...elements.favoriteMovie.options].forEach((option, index) => { option.value = state.movies[index].id; });

  const featured = state.movies[0];
  document.querySelector("#heroImage").src = featured.backdrop;
  document.querySelector("#heroTitle").textContent = featured.title;
  document.querySelector("#heroOverview").textContent = featured.overview;
  attachEvents();
  render();
  await loadMoreDiscover();
}

window.addEventListener("pywebviewready", startApp);