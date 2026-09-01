// Central application state shared by rendering and event handlers.
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
  searchRequestId: 0,
  selectedMovie: null,
  featuredIndex: 0,
  user: null,
};

// Cache frequently used DOM elements so functions do not repeatedly query them.
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
  chatLauncher: document.querySelector("#chatLauncher"),
  chatPanel: document.querySelector("#chatPanel"),
  chatMessages: document.querySelector("#chatMessages"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  chatSend: document.querySelector("#chatSend"),
  authButton: document.querySelector("#authButton"),
  authDialog: document.querySelector("#authDialog"),
  authForm: document.querySelector("#authForm"),
  authNameField: document.querySelector("#authNameField"),
  authName: document.querySelector("#authName"),
  authEmail: document.querySelector("#authEmail"),
  authPassword: document.querySelector("#authPassword"),
  authError: document.querySelector("#authError"),
  quickMoods: document.querySelector("#quickMoods"),
  discoveryPulse: document.querySelector("#discoveryPulse"),
  activeFilterCount: document.querySelector("#activeFilterCount"),
};

// Hosted browsers call Flask; the desktop build uses Python through PyWebView.
async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || `Request failed with status ${response.status}`);
  return body;
}

const webApi = {
  get_movies: () => fetchJson("/api/movies"),
  discover_movies: (skip) => fetchJson(`/api/discover?skip=${encodeURIComponent(skip)}`),
  search_movies: (query) => fetchJson(`/api/search?q=${encodeURIComponent(query)}`),
  recommend: (movieId) => fetchJson(`/api/recommend/${encodeURIComponent(movieId)}`),
  recommend_for_user: () => fetchJson("/api/recommendations/personalized"),
  chat: (message) => fetchJson("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  }),
  get_session: () => fetchJson("/api/auth/session"),
  signup: (name, email, password) => fetchJson("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  }),
  login: (email, password) => fetchJson("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }),
  logout: () => fetchJson("/api/auth/logout", { method: "POST" }),
  get_watchlist: async () => {
    if (state.user) return fetchJson("/api/watchlist");
    try {
      return JSON.parse(localStorage.getItem("mrsmovies_watchlist") || "[]");
    } catch (error) {
      return [];
    }
  },
  toggle_watchlist: async (movieId) => {
    if (state.user) return fetchJson(`/api/watchlist/${encodeURIComponent(movieId)}`, { method: "POST" });
    const watchlist = await webApi.get_watchlist();
    const updated = watchlist.includes(movieId)
      ? watchlist.filter((id) => id !== movieId)
      : [...watchlist, movieId];
    localStorage.setItem("mrsmovies_watchlist", JSON.stringify(updated));
    return updated;
  },
  open_url: async (url) => {
    if (!url.startsWith("https://www.imdb.com/title/")) return false;
    window.open(url, "_blank", "noopener");
    return true;
  },
};

function backendApi() {
  return window.pywebview?.api || webApi;
}

// ---------- Account sessions ----------
function setAuthMode(mode) {
  const isSignup = mode === "signup";
  elements.authForm.dataset.mode = mode;
  elements.authNameField.classList.toggle("hidden", !isSignup);
  elements.authName.required = isSignup;
  elements.authPassword.autocomplete = isSignup ? "new-password" : "current-password";
  document.querySelector("#authTitle").textContent = isSignup ? "Create your account" : "Welcome back";
  document.querySelector("#authCopy").textContent = isSignup
    ? "Save a personal watchlist across signed-in sessions."
    : "Sign in to open your account watchlist.";
  document.querySelector("#authSubmit").textContent = isSignup ? "Create account" : "Sign in";
  document.querySelector("#authSwitch").textContent = isSignup ? "Already have an account? Sign in" : "New to MRSmovies? Create account";
  elements.authError.textContent = "";
}

function renderAccount() {
  if (window.location.protocol === "file:") return;
  elements.authButton.classList.remove("hidden");
  elements.authButton.textContent = state.user ? state.user.name.split(" ")[0] : "Sign in";
  elements.authButton.title = state.user ? "Account options" : "Sign in or create an account";
}

async function completeAuthentication(response) {
  state.user = response.user;
  state.recommendations = [];
  state.watchlist = await webApi.get_watchlist();
  elements.authDialog.close();
  elements.authForm.reset();
  renderAccount();
  render();
  showToast(`Signed in as ${state.user.name}`);
}

async function submitAuthentication(event) {
  event.preventDefault();
  const submitButton = document.querySelector("#authSubmit");
  submitButton.disabled = true;
  elements.authError.textContent = "";
  try {
    const mode = elements.authForm.dataset.mode;
    const response = mode === "signup"
      ? await webApi.signup(elements.authName.value, elements.authEmail.value, elements.authPassword.value)
      : await webApi.login(elements.authEmail.value, elements.authPassword.value);
    await completeAuthentication(response);
  } catch (error) {
    elements.authError.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
}

async function openAccount() {
  if (!state.user) {
    setAuthMode("login");
    elements.authDialog.showModal();
    elements.authEmail.focus();
    return;
  }

  if (window.confirm(`Sign out of ${state.user.email}?`)) {
    await webApi.logout();
    state.user = null;
    state.recommendations = [];
    state.watchlist = await webApi.get_watchlist();
    elements.recommendationPanel.classList.toggle("hidden", state.view !== "recommended");
    renderAccount();
    render();
    showToast("You are signed out");
  }
}

// ---------- Theme ----------
function setTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  elements.themeToggle.textContent = isDark ? "☼" : "☾";
  elements.themeToggle.setAttribute("aria-label", isDark ? "Enable light mode" : "Enable dark mode");
  elements.themeToggle.title = isDark ? "Enable light mode" : "Enable dark mode";
}

function loadTheme() {
  const savedTheme = localStorage.getItem("mrsmovies_theme");
  setTheme(savedTheme || "dark");
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("mrsmovies_theme", nextTheme);
  setTheme(nextTheme);
}

loadTheme();
document.querySelector("#footerYear").textContent = new Date().getFullYear();

// ---------- Small UI helpers ----------
function escapeHtml(value) {
  const textContainer = document.createElement("span");
  textContainer.textContent = String(value);
  return textContainer.innerHTML;
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

function genreColor(movie) {
  const colors = {
    Action: "#ff5b43",
    Adventure: "#f1bd50",
    Animation: "#5d8cff",
    Comedy: "#55c59f",
    Crime: "#d16d91",
    Drama: "#c18cff",
    Horror: "#98a0ad",
    "Sci-Fi": "#42b9c5",
    Thriller: "#ff8a4c",
  };
  return colors[movie.genres[0]] || "#55c59f";
}

function updateDiscoveryPulse(movies) {
  const activeFilters = [elements.type, elements.genre, elements.mood]
    .filter((control) => control.value !== "All").length;
  const averageRating = movies.length
    ? movies.reduce((total, movie) => total + Number(movie.rating || 0), 0) / movies.length
    : 0;
  elements.discoveryPulse.textContent = movies.length
    ? `${movies.length} picks · ${averageRating.toFixed(1)} average rating`
    : "Ready for a new direction";
  elements.activeFilterCount.textContent = activeFilters ? `${activeFilters} active` : "All stories";
  elements.quickMoods.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", elements.mood.value === button.dataset.quickMood);
  });
}

// ---------- Catalog filtering and rendering ----------
function allKnownMovies() {
  return [...state.movies, ...state.discoverMovies, ...state.onlineMovies].filter(
    (movie, index, movies) => movies.findIndex((item) => item.id === movie.id) === index,
  );
}

function currentMovies() {
  if (state.view === "watchlist") {
    return allKnownMovies().filter((movie) => state.watchlist.includes(movie.id));
  }

  if (state.view === "recommended") {
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
  const rating = movie.rating ? `★ ${movie.rating.toFixed(1)}` : "IMDb";
  const secondaryAction = movie.source === "imdb"
    ? `<button class="secondary" data-open="${escapeHtml(movie.external_url)}">IMDb</button>`
    : `<button class="secondary ${saved ? "saved" : ""}" data-watchlist="${movie.id}">${saved ? "Saved" : "Add"}</button>`;

  return `
    <article class="movie-card" style="--card-accent: ${genreColor(movie)}; animation-delay: ${Math.min(index * 45, 300)}ms">
      <button class="poster-button" data-details="${movie.id}" aria-label="View ${escapeHtml(movie.title)} details">
        <span class="poster-tag">${escapeHtml(movie.type)}</span>
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
  updateDiscoveryPulse(movies);
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
    elements.title.textContent = query ? `Search results for "${query}"` : "Latest releases";
    elements.subtitle.textContent = state.isSearchingOnline
      ? "Searching the online movie catalog..."
      : query ? "Matching local and online titles." : "Fresh additions from the current movie year.";
  }
}

// Pagination loads more online catalog pages only when they are requested.
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

// ---------- Movie details and watchlist ----------
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
  state.watchlist = await backendApi().toggle_watchlist(movieId);
  updateDialogButton();
  render();
  renderMovieTicker();
  showToast(state.watchlist.includes(movieId) ? "Added to your watchlist" : "Removed from your watchlist");
}

async function makeRecommendations() {
  const movieId = elements.favoriteMovie.value;
  state.recommendations = await backendApi().recommend(movieId);
  render();
}

// ---------- Featured recommendation marquee ----------
// Continuously scrolling, mirrored-fan carousel modeled on melius.com's hero motion:
// a repeated strip of cards drifts sideways while each card's tilt/scale/opacity is
// recomputed every frame from its live distance to the stage's center.
const marquee = {
  offset: 0,
  speed: 46,
  itemWidth: 0,
  paused: false,
  lastTimestamp: null,
  rafId: null,
  centered: false,
};

function featuredMovies() {
  return state.movies.slice(0, 5);
}

function buildFeaturedMarquee() {
  const movies = featuredMovies();
  const track = document.querySelector("#heroMarqueeTrack");
  if (!movies.length || !track) return;
  const loops = 4;
  const items = [];
  for (let loop = 0; loop < loops; loop += 1) movies.forEach((movie) => items.push(movie));
  track.innerHTML = items.map((movie) => `
    <button class="hero-marquee-item" data-movie-id="${movie.id}" type="button" aria-label="View ${escapeHtml(movie.title)} details">
      <img src="${escapeHtml(movie.backdrop)}" alt="">
      <span class="hero-marquee-title">${escapeHtml(movie.title)}</span>
    </button>
  `).join("");
  document.querySelector("#heroDots").innerHTML = movies.map((movie, movieIndex) => `
    <button class="hero-dot ${movieIndex === state.featuredIndex ? "active" : ""}" data-featured="${movieIndex}" aria-label="Show ${escapeHtml(movie.title)}"></button>
  `).join("");
}

function updateFeaturedInfo(movie) {
  const movies = featuredMovies();
  const movieIndex = movies.findIndex((item) => item.id === movie.id);
  if (movieIndex === -1) return;
  if (movieIndex === state.featuredIndex && marquee.centered) return;
  marquee.centered = true;
  state.featuredIndex = movieIndex;
  document.querySelector("#heroAmbientImage").src = movie.backdrop;
  document.querySelector("#heroTitle").textContent = movie.title;
  document.querySelector("#heroMetaGenre").textContent = movie.genres[0] || "\u2014";
  document.querySelector("#heroMetaMood").textContent = movie.moods[0] || "\u2014";
  document.querySelector("#heroMetaDirector").textContent = movie.director || "\u2014";
  document.querySelector("#heroMetaRating").textContent = `\u2605 ${movie.rating.toFixed(1)} \u00b7 ${movie.year}`;
  document.querySelector("#heroOverview").textContent = movie.overview;
  document.querySelectorAll("#heroDots [data-featured]").forEach((dot, index) => {
    dot.classList.toggle("active", index === movieIndex);
  });
}

function jumpFeaturedBy(steps) {
  const movies = featuredMovies();
  if (!movies.length || !marquee.itemWidth) return;
  marquee.offset += steps * marquee.itemWidth;
  const loopWidth = marquee.itemWidth * movies.length;
  while (marquee.offset < loopWidth) marquee.offset += loopWidth;
}

function jumpFeaturedTo(targetIndex) {
  const movies = featuredMovies();
  if (!movies.length) return;
  let diff = (targetIndex - state.featuredIndex) % movies.length;
  if (diff > movies.length / 2) diff -= movies.length;
  if (diff < -movies.length / 2) diff += movies.length;
  jumpFeaturedBy(diff);
}

function stepMarquee(timestamp) {
  const track = document.querySelector("#heroMarqueeTrack");
  const stage = document.querySelector("#heroStage");
  if (!track || !stage) return;
  if (marquee.lastTimestamp == null) marquee.lastTimestamp = timestamp;
  const delta = Math.min((timestamp - marquee.lastTimestamp) / 1000, 0.1);
  marquee.lastTimestamp = timestamp;

  if (!marquee.itemWidth) {
    const firstItem = track.querySelector(".hero-marquee-item");
    const trackStyle = firstItem && getComputedStyle(track);
    // offsetWidth ignores the per-frame rotate/scale transforms, unlike getBoundingClientRect.
    if (firstItem) marquee.itemWidth = firstItem.offsetWidth + parseFloat(trackStyle.columnGap || "0");
    if (marquee.itemWidth) {
      const movies = featuredMovies();
      marquee.offset = marquee.itemWidth * movies.length - stage.getBoundingClientRect().width / 2 + marquee.itemWidth / 2;
    }
  }

  if (!marquee.paused && marquee.itemWidth) {
    marquee.offset += marquee.speed * delta;
    const loopWidth = marquee.itemWidth * featuredMovies().length;
    if (loopWidth > 0 && marquee.offset >= loopWidth * 2) marquee.offset -= loopWidth;
  }
  track.style.transform = `translateX(${-marquee.offset}px)`;

  const stageRect = stage.getBoundingClientRect();
  const centerX = stageRect.left + stageRect.width / 2;
  let closestItem = null;
  let closestDistance = Infinity;
  track.querySelectorAll(".hero-marquee-item").forEach((item) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distance = Math.abs(itemCenter - centerX);
    const normalized = Math.max(-1.4, Math.min(1.4, (itemCenter - centerX) / (stageRect.width / 2)));
    item.style.transform = `rotateY(${normalized * 32}deg) scale(${1 - Math.min(Math.abs(normalized), 1) * 0.3})`;
    item.style.opacity = String(Math.max(0.16, 1 - Math.min(Math.abs(normalized), 1) * 0.75));
    item.style.zIndex = String(1000 - Math.round(distance));
    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }
  });

  if (closestItem) {
    const movie = featuredMovies().find((item) => item.id === closestItem.dataset.movieId);
    if (movie) updateFeaturedInfo(movie);
  }

  marquee.rafId = requestAnimationFrame(stepMarquee);
}

function startFeaturedRotation() {
  if (marquee.rafId) return;
  marquee.speed = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 46;
  marquee.lastTimestamp = null;
  marquee.rafId = requestAnimationFrame(stepMarquee);
}

function renderMovieTicker() {
  // Show titles beyond the hero's rotation so this row isn't just a repeat of it.
  const featuredIds = new Set(featuredMovies().map((movie) => movie.id));
  const trendingMovies = state.movies
    .filter((movie) => !featuredIds.has(movie.id))
    .sort((first, second) => second.rating - first.rating);
  document.querySelector("#movieTicker").innerHTML = trendingMovies.slice(0, 4).map(movieCard).join("");
}

function setupPageMotion() {
  const motionSections = document.querySelectorAll(".movie-ticker, .discovery-bar, .filters, .section-heading, .movie-grid, .pagination");
  motionSections.forEach((section) => section.classList.add("motion-section"));

  let motionFrame = null;
  const updateScrollMotion = () => {
    motionFrame = null;
    const scrollAmount = Math.min(window.scrollY, 320);
    document.querySelector(".topbar").classList.toggle("scrolled", window.scrollY > 24);
    document.querySelector("#hero").style.setProperty("--hero-copy-shift", `${scrollAmount * 0.1}px`);
    document.querySelector("#hero").style.setProperty("--hero-stage-shift", `${scrollAmount * -0.06}px`);
    motionSections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) section.classList.add("in-view");
    });
  };
  window.addEventListener("scroll", () => {
    if (!motionFrame) motionFrame = window.requestAnimationFrame(updateScrollMotion);
  }, { passive: true });
  updateScrollMotion();
  window.requestAnimationFrame(updateScrollMotion);
  window.addEventListener("pageshow", updateScrollMotion, { once: true });
}

// ---------- MRS Chat Bot interface ----------
function setChatOpen(isOpen) {
  // Keep visual state and screen-reader state synchronized.
  elements.chatPanel.classList.toggle("hidden", !isOpen);
  elements.chatLauncher.setAttribute("aria-expanded", String(isOpen));
  elements.chatLauncher.setAttribute("aria-label", isOpen ? "Close MRS Chat Bot" : "Open MRS Chat Bot");
  if (isOpen) elements.chatInput.focus();
}

function appendChatMessage(role, message, movieIds = []) {
  // textContent is used for chatbot text to prevent HTML injection.
  const messageElement = document.createElement("p");
  messageElement.className = `chat-message ${role}`;
  messageElement.textContent = message;
  elements.chatMessages.append(messageElement);

  if (movieIds.length) {
    // Python returns IDs; the browser enriches them with existing catalog data.
    const suggestions = document.createElement("div");
    suggestions.className = "chat-suggestions";
    movieIds.forEach((movieId) => {
      const movie = allKnownMovies().find((item) => item.id === movieId);
      if (!movie) return;
      const button = document.createElement("button");
      button.className = "chat-suggestion";
      button.dataset.chatMovie = movie.id;
      const poster = document.createElement("img");
      poster.src = movie.poster;
      poster.alt = "";
      const details = document.createElement("span");
      const title = document.createElement("strong");
      title.textContent = movie.title;
      const metadata = document.createElement("small");
      metadata.textContent = `${movie.year} · ${movie.genres.slice(0, 2).join(" / ")} · ${movie.rating.toFixed(1)}`;
      details.append(title, metadata);
      const arrow = document.createElement("span");
      arrow.className = "chat-suggestion-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = ">";
      button.append(poster, details, arrow);
      suggestions.append(button);
    });
    elements.chatMessages.append(suggestions);
  }

  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  return messageElement;
}

async function sendChatMessage(message) {
  const cleanMessage = message.trim();
  if (!cleanMessage || elements.chatSend.disabled) return;

  // Replace the welcome screen with the conversation after the first message.
  document.querySelector("#chatPrompts")?.remove();
  document.querySelector(".chat-welcome")?.remove();
  appendChatMessage("user", cleanMessage);
  elements.chatInput.value = "";
  elements.chatInput.disabled = true;
  elements.chatSend.disabled = true;
  const pendingMessage = appendChatMessage("assistant pending", "Thinking...");

  // PyWebView exposes MovieApi.chat as an asynchronous JavaScript method.
  try {
    const response = await backendApi().chat(cleanMessage);
    pendingMessage.remove();
    appendChatMessage("assistant", response.message, response.movie_ids);
  } catch (error) {
    pendingMessage.textContent = "MRS Chat Bot couldn't answer that right now. Please try again.";
  } finally {
    // Always restore the composer, including after a Python/API error.
    elements.chatInput.disabled = false;
    elements.chatSend.disabled = false;
    elements.chatInput.focus();
  }
}

// ---------- Online catalog and page navigation ----------
async function loadMoreDiscover() {
  if (state.isLoadingDiscover || !state.hasMoreDiscover) return false;

  state.isLoadingDiscover = true;
  render();
  const nextMovies = await backendApi().discover_movies(state.discoverSkip);
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

async function changeView(view) {
  state.view = view;
  document.querySelectorAll(".nav button").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  elements.recommendationPanel.classList.toggle("hidden", view !== "recommended" || Boolean(state.user));
  elements.filterPanel.classList.toggle("hidden", view !== "discover");
  document.querySelector("#hero").classList.toggle("hidden", view !== "discover");
  if (view === "recommended" && state.user) {
    try {
      state.recommendations = await webApi.recommend_for_user();
      if (!state.recommendations.length) showToast("Save a few catalog movies to shape your recommendations");
    } catch (error) {
      state.recommendations = [];
      showToast("Personalized recommendations are unavailable right now");
    }
  }
  render();
}

// ---------- User interaction wiring ----------
function attachEvents() {
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) startFeaturedRotation();
  });
  elements.search.addEventListener("input", () => {
    // Invalidate any online request that was started for the previous query.
    state.searchRequestId += 1;
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
    const requestId = ++state.searchRequestId;
    state.isSearchingOnline = true;
    render();
    try {
      const movies = await backendApi().search_movies(query);
      if (requestId !== state.searchRequestId) return;
      state.onlineMovies = movies;
      if (!movies.length) showToast("No online results found. Check your connection or try another title.");
    } catch (error) {
      if (requestId === state.searchRequestId) showToast("Online search is unavailable. Please try again.");
    } finally {
      if (requestId === state.searchRequestId) {
        state.isSearchingOnline = false;
        render();
      }
    }
  });
  elements.themeToggle.addEventListener("click", toggleTheme);
  elements.quickMoods.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quick-mood]");
    if (!button) return;
    elements.mood.value = elements.mood.value === button.dataset.quickMood ? "All" : button.dataset.quickMood;
    state.currentPage = 1;
    changeView("discover");
  });
  document.querySelector("#surpriseButton").addEventListener("click", () => {
    const movies = currentMovies().length ? currentMovies() : state.movies;
    if (!movies.length) return;
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    showMovie(movies[randomValues[0] % movies.length].id);
  });
  elements.authButton.addEventListener("click", openAccount);
  elements.authForm.addEventListener("submit", submitAuthentication);
  document.querySelector("#authSwitch").addEventListener("click", () => {
    setAuthMode(elements.authForm.dataset.mode === "login" ? "signup" : "login");
  });
  document.querySelector("#authClose").addEventListener("click", () => elements.authDialog.close());
  elements.chatLauncher.addEventListener("click", () => setChatOpen(elements.chatPanel.classList.contains("hidden")));
  document.querySelector("#chatClose").addEventListener("click", () => setChatOpen(false));
  elements.chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendChatMessage(elements.chatInput.value);
  });
  elements.chatMessages.addEventListener("click", (event) => {
    const prompt = event.target.closest("[data-prompt]");
    const movie = event.target.closest("[data-chat-movie]");
    if (prompt) sendChatMessage(prompt.dataset.prompt);
    if (movie) showMovie(movie.dataset.chatMovie);
  });
  elements.pagination.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) goToPage(Number(pageButton.dataset.page));
  });
  document.querySelector("#movieTicker").addEventListener("click", (event) => {
    const details = event.target.closest("[data-details]");
    const watchlist = event.target.closest("[data-watchlist]");
    const externalLink = event.target.closest("[data-open]");
    if (details) showMovie(details.dataset.details);
    if (watchlist) toggleWatchlist(watchlist.dataset.watchlist);
    if (externalLink) backendApi().open_url(externalLink.dataset.open);
  });
  document.querySelector("#resetFilters").addEventListener("click", () => {
    elements.search.value = "";
    elements.type.value = "All";
    elements.genre.value = "All";
    elements.mood.value = "All";
    elements.sort.value = "year";
    state.currentPage = 1;
    render();
  });

  document.querySelectorAll(".nav button[data-view]").forEach((button) => button.addEventListener("click", () => changeView(button.dataset.view)));
  document.querySelector("#heroDetails").addEventListener("click", () => showMovie(featuredMovies()[state.featuredIndex].id));
  document.querySelector("#heroPrevious").addEventListener("click", () => jumpFeaturedBy(-1));
  document.querySelector("#heroNext").addEventListener("click", () => jumpFeaturedBy(1));
  document.querySelector("#heroDots").addEventListener("click", (event) => {
    const dot = event.target.closest("[data-featured]");
    if (!dot) return;
    jumpFeaturedTo(Number(dot.dataset.featured));
  });
  const heroStage = document.querySelector("#heroStage");
  heroStage.addEventListener("click", (event) => {
    const item = event.target.closest("[data-movie-id]");
    if (item) showMovie(item.dataset.movieId);
  });
  heroStage.addEventListener("mouseenter", () => { marquee.paused = true; });
  heroStage.addEventListener("mouseleave", () => { marquee.paused = false; });
  window.addEventListener("resize", () => { marquee.itemWidth = 0; });
  let swipeStartX = null;
  heroStage.addEventListener("pointerdown", (event) => { swipeStartX = event.clientX; });
  heroStage.addEventListener("pointerup", (event) => {
    if (swipeStartX === null || Math.abs(event.clientX - swipeStartX) < 45) return;
    jumpFeaturedBy(event.clientX < swipeStartX ? 1 : -1);
    swipeStartX = null;
  });
  elements.grid.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const card = event.target.closest(".movie-card");
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--card-rx", `${((event.clientY - bounds.top) / bounds.height - 0.5) * -5}deg`);
    card.style.setProperty("--card-ry", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 6}deg`);
  });
  elements.grid.addEventListener("pointerout", (event) => {
    const card = event.target.closest(".movie-card");
    if (!card || card.contains(event.relatedTarget)) return;
    card.style.removeProperty("--card-rx");
    card.style.removeProperty("--card-ry");
  });
  document.querySelector("#recommendButton").addEventListener("click", makeRecommendations);
  document.querySelector("#closeDialog").addEventListener("click", () => elements.dialog.close());
  document.querySelector("#dialogWatchlist").addEventListener("click", () => {
    if (state.selectedMovie.source === "imdb") {
      backendApi().open_url(state.selectedMovie.external_url);
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
    if (externalLink) backendApi().open_url(externalLink.dataset.open);
  });

}

// ---------- Application startup ----------
async function startApp() {
  state.movies = await backendApi().get_movies();
  if (window.location.protocol !== "file:") {
    const account = await webApi.get_session();
    state.user = account.user;
    renderAccount();
  }
  state.watchlist = await backendApi().get_watchlist();

  // Preload carousel images so automatic changes do not wait on the network.
  featuredMovies().forEach((movie) => {
    const image = new Image();
    image.src = movie.backdrop;
  });
  renderMovieTicker();

  const genres = [...new Set(state.movies.flatMap((movie) => movie.genres))].sort();
  const moods = [...new Set(state.movies.flatMap((movie) => movie.moods))].sort();
  fillSelect(elements.genre, genres);
  fillSelect(elements.mood, moods);
  const popularMoods = [...state.movies.flatMap((movie) => movie.moods)
    .reduce((counts, mood) => counts.set(mood, (counts.get(mood) || 0) + 1), new Map())]
    .sort((first, second) => second[1] - first[1])
    .slice(0, 5)
    .map(([mood]) => mood);
  elements.quickMoods.innerHTML = popularMoods.map((mood) => (
    `<button type="button" data-quick-mood="${escapeHtml(mood)}">${escapeHtml(mood)}</button>`
  )).join("");
  fillSelect(elements.favoriteMovie, state.movies.map((movie) => movie.title));
  [...elements.favoriteMovie.options].forEach((option, index) => { option.value = state.movies[index].id; });

  buildFeaturedMarquee();
  startFeaturedRotation();
  attachEvents();
  setupPageMotion();
  render();
  await loadMoreDiscover();
}

// Desktop waits for Python; hosted pages can start when the DOM is ready.
if (window.location.protocol === "file:") {
  window.addEventListener("pywebviewready", startApp);
} else if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", startApp);
} else {
  startApp();
}