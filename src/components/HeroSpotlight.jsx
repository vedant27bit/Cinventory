export function HeroSpotlight({
  featuredMovie,
  onSelectMovie,
  isFavorite,
  onToggleFavorite,
}) {
  if (!featuredMovie) return null;

  return (
    <div className="hero-spotlight">
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(10, 11, 14, 0.95) 20%, rgba(10, 11, 14, 0.6) 60%, rgba(10, 11, 14, 0.9) 100%), linear-gradient(to top, rgba(10, 11, 14, 1) 0%, transparent 60%), url(${featuredMovie.backdrop || featuredMovie.poster})`
        }}
      />

      <div className="hero-content">
        <div className="hero-tag">FEATURED SPOTLIGHT</div>
        <h1 className="hero-title">{featuredMovie.title}</h1>

        <div className="hero-metadata">
          <span className="hero-badge-imdb">⭐ IMDb {featuredMovie.imdb}</span>
          <span className="hero-pill">{featuredMovie.genre}</span>
          <span className="hero-pill">{featuredMovie.year}</span>
          <span className="hero-pill">{featuredMovie.duration}</span>
        </div>

        <p className="hero-description">{featuredMovie.description}</p>

        <div className="hero-buttons">
          <button
            className="hero-primary-btn"
            onClick={() => onSelectMovie(featuredMovie)}
          >
            ℹ️ View Info & Trailer
          </button>
          <button
            className={`hero-secondary-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(featuredMovie.id)}
          >
            {isFavorite ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
}
