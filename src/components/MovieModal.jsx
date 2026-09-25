import { useEffect } from 'react';

export function MovieModal({
  movie,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!movie) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div
          className="modal-banner"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(10, 11, 14, 0.3), rgba(10, 11, 14, 0.95)), url(${movie.backdrop || movie.poster})`
          }}
        >
          <div className="modal-banner-info">
            <span className="modal-genre-tag">{movie.genre}</span>
            <h2 className="modal-title">{movie.title}</h2>
            <div className="modal-meta-row">
              <span className="meta-badge-imdb">⭐ IMDb {movie.imdb}</span>
              <span className="meta-badge">👥 User {movie.rating} / 5</span>
              <span className="meta-badge">📅 {movie.year}</span>
              <span className="meta-badge">⏱️ {movie.duration || '2h 15m'}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-body-left">
            <img
              src={movie.poster}
              alt={movie.title}
              className="modal-poster-img"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div className="modal-body-right">
            <h3>Synopsis</h3>
            <p className="modal-description">{movie.description}</p>

            <div className="modal-actions">
              <button
                className={`modal-favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite(movie.id)}
              >
                {isFavorite ? '❤️ In Watchlist' : '🤍 Add to Watchlist'}
              </button>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' official trailer')}`}
                target="_blank"
                rel="noreferrer"
                className="modal-trailer-btn"
              >
                ▶ Watch Trailer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
