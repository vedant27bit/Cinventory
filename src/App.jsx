import { useState, useMemo, useEffect } from 'react';
import { movies as initialMovies } from './data/movies.js';
import { Header } from './components/Header.jsx';
import { HeroSpotlight } from './components/HeroSpotlight.jsx';
import { PosterRow } from './components/PosterRow.jsx';
import { MovieCard } from './components/moviecard.jsx';
import { MovieModal } from './components/MovieModal.jsx';
import './App.css';

function App() {
  const [movies] = useState(initialMovies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [viewMode, setViewMode] = useState('scrolling'); // 'scrolling' or 'grid'
  const [showOnlyWatchlist, setShowOnlyWatchlist] = useState(false);

  // Persistent Watchlist in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('cinventory_watchlist');
      return saved ? JSON.parse(saved) : [1, 2]; // Inception & Interstellar pre-favorited as showcase
    } catch {
      return [1, 2];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cinventory_watchlist', JSON.stringify(favorites));
    } catch (err) {
      console.error('Could not save watchlist to localStorage', err);
    }
  }, [favorites]);

  const toggleFavorite = (movieId) => {
    setFavorites((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  // Extract unique genres
  const genres = useMemo(() => {
    const set = new Set(movies.map((m) => m.genre));
    return ['All', ...Array.from(set)];
  }, [movies]);

  // Filtered movies based on search & genre & watchlist
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre =
        selectedGenre === 'All' || movie.genre === selectedGenre;

      const matchesWatchlist =
        !showOnlyWatchlist || favorites.includes(movie.id);

      return matchesSearch && matchesGenre && matchesWatchlist;
    });
  }, [movies, searchTerm, selectedGenre, showOnlyWatchlist, favorites]);

  // Rows for curated scrolling showcase
  const trendingMovies = useMemo(
    () => [...movies].sort((a, b) => b.rating - a.rating),
    [movies]
  );
  const topRatedMovies = useMemo(
    () => [...movies].filter((m) => m.imdb >= 8.7),
    [movies]
  );
  const sciFiMovies = useMemo(
    () => movies.filter((m) => m.genre === 'Sci-Fi'),
    [movies]
  );
  const actionMovies = useMemo(
    () => movies.filter((m) => m.genre === 'Action' || m.genre === 'Crime'),
    [movies]
  );

  const featuredMovie = movies[1] || movies[0]; // Interstellar or Inception

  const handleGoHome = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setShowOnlyWatchlist(false);
    setSelectedMovie(null);
    setViewMode('scrolling');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFiltering =
    searchTerm.trim() !== '' || selectedGenre !== 'All' || showOnlyWatchlist;

  return (
    <div className="cinventory-app">
      {/* Top Header with Cinventory at Top Right */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeGenre={selectedGenre}
        setActiveGenre={setSelectedGenre}
        genres={genres}
        watchlistCount={favorites.length}
        showOnlyWatchlist={showOnlyWatchlist}
        setShowOnlyWatchlist={setShowOnlyWatchlist}
        onGoHome={handleGoHome}
      />

      {/* Featured Hero Banner if not actively searching/filtering */}
      {!isFiltering && (
        <HeroSpotlight
          featuredMovie={featuredMovie}
          onSelectMovie={setSelectedMovie}
          isFavorite={favorites.includes(featuredMovie.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* Controls Bar: Genre Chips & View Modes */}
      <div className="controls-bar">
        <div className="genre-chips-scroll">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-chip ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="view-mode-toggle">
          <span className="toggle-label">Layout:</span>
          <button
            className={`mode-btn ${viewMode === 'scrolling' ? 'active' : ''}`}
            onClick={() => setViewMode('scrolling')}
            title="Horizontal Scrolling Poster Rails"
          >
            ↔ Scroll Rails
          </button>
          <button
            className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid Poster View"
          >
            ⊞ Grid
          </button>
        </div>
      </div>

      <main className="content-container">
        {isFiltering ? (
          /* Search or Filter Results */
          <div className="search-results-section">
            <div className="results-header">
              <h2>
                {showOnlyWatchlist
                  ? '❤️ Your Watchlist'
                  : searchTerm
                  ? `Search Results for "${searchTerm}"`
                  : `${selectedGenre} Movies`}
              </h2>
              <span className="results-count">
                {filteredMovies.length}{' '}
                {filteredMovies.length === 1 ? 'movie' : 'movies'} found
              </span>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎬</span>
                <h3>No movies found</h3>
                <p>Try searching for a different keyword or clearing filters.</p>
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre('All');
                    setShowOnlyWatchlist(false);
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'scrolling' ? (
              <PosterRow
                title="Matched Movie Posters"
                icon="🎯"
                movies={filteredMovies}
                onSelectMovie={setSelectedMovie}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            ) : (
              <div className="movie-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelectMovie={setSelectedMovie}
                    isFavorite={favorites.includes(movie.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        ) : viewMode === 'scrolling' ? (
          /* Multi-Row Horizontal Scrolling Showcase */
          <div className="scrolling-showcase">
            <PosterRow
              title="Trending & Popular"
              icon="🔥"
              badge="Hot"
              movies={trendingMovies}
              onSelectMovie={setSelectedMovie}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            <PosterRow
              title="Top Rated on IMDb"
              icon="⭐"
              badge="IMDb 8.7+"
              movies={topRatedMovies}
              onSelectMovie={setSelectedMovie}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            <PosterRow
              title="Sci-Fi & Cosmic Horizons"
              icon="🚀"
              movies={sciFiMovies}
              onSelectMovie={setSelectedMovie}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            <PosterRow
              title="Action & High Stakes"
              icon="⚡"
              movies={actionMovies}
              onSelectMovie={setSelectedMovie}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        ) : (
          /* Grid View Mode */
          <div className="all-movies-grid-section">
            <div className="results-header">
              <h2>All Movie Titles</h2>
              <span className="results-count">{movies.length} movies</span>
            </div>
            <div className="movie-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onSelectMovie={setSelectedMovie}
                  isFavorite={favorites.includes(movie.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorite={favorites.includes(selectedMovie.id)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <footer className="site-footer">
        <p>
          <strong>Cinventory</strong> • Curated Cinematic Library &bull; Designed
          with React
        </p>
      </footer>
    </div>
  );
}

export default App;
