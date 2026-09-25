export function MovieCard({
  movie,
  onSelectMovie,
  isFavorite,
  onToggleFavorite,
  compact = false,
}) {
  const fallbackPoster =
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80";

  return (
    <div
      className={`movie-card ${compact ? "movie-card-compact" : ""}`}
      onClick={() => onSelectMovie && onSelectMovie(movie)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onSelectMovie) onSelectMovie(movie);
      }}
    >
      <div className="poster-wrapper">
        <img
          src={movie.poster}
          alt={movie.title}
          className="movie-poster"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackPoster;
          }}
        />

        <div className="card-top-badges">
          <span className="badge-imdb">⭐ {movie.imdb}</span>
          <span className="badge-year">{movie.year}</span>
        </div>

        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie.id);
          }}
          title={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
          aria-label="Toggle Watchlist"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>

        <div className="poster-overlay">
          <span className="genre-pill">{movie.genre}</span>
          <h3 className="overlay-title">{movie.title}</h3>
          <p className="overlay-desc">{movie.description}</p>
          <div className="overlay-footer">
            <span className="user-score">👥 {movie.rating} / 5</span>
            <span className="details-prompt">Click for details →</span>
          </div>
        </div>
      </div>

      <div className="movie-card-info">
        <h4 className="movie-title" title={movie.title}>
          {movie.title}
        </h4>
        <div className="movie-sub-info">
          <span className="movie-genre-text">{movie.genre}</span>
          <span className="movie-duration-text">{movie.duration || "2h"}</span>
        </div>
      </div>
    </div>
  );
}