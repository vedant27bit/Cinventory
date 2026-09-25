export function Header({
  searchTerm,
  setSearchTerm,
  activeGenre,
  setActiveGenre,
  genres,
  watchlistCount,
  showOnlyWatchlist,
  setShowOnlyWatchlist,
  onGoHome,
}) {
  return (
    <header className="site-header">
      <div className="header-left">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search movies, genres, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`watchlist-pill-btn ${showOnlyWatchlist ? 'active' : ''}`}
          onClick={() => setShowOnlyWatchlist(!showOnlyWatchlist)}
        >
          <span>❤️ Watchlist</span>
          {watchlistCount > 0 && <span className="counter-badge">{watchlistCount}</span>}
        </button>
      </div>

      {/* User requested CINVENTORY explicitly at the top right */}
      <div className="header-right-brand">
        <div
          className="brand-container brand-clickable"
          onClick={onGoHome}
          role="button"
          tabIndex={0}
          title="Go to Home"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onGoHome && onGoHome();
            }
          }}
        >
          <div className="brand-glow"></div>
          <span className="brand-icon">🎬</span>
          <span className="brand-text">Cinventory</span>
          <span className="brand-tag">v2</span>
        </div>
      </div>
    </header>
  );
}
