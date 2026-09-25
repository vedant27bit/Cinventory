import { useRef, useState, useEffect } from 'react';
import { MovieCard } from './moviecard.jsx';

export function PosterRow({
  title,
  icon = "🎬",
  movies = [],
  onSelectMovie,
  favorites = [],
  onToggleFavorite,
  badge = null
}) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [movies]);

  const handleScroll = (direction) => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Support mouse wheel horizontal scrolling
  const handleWheel = (e) => {
    if (!rowRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // Allow user to use mouse wheel vertically to scroll row horizontally if hovering over rail
      if (e.shiftKey) return; // standard browser shift+wheel already works
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="poster-row-section">
      <div className="row-header">
        <div className="row-title-area">
          <span className="row-icon">{icon}</span>
          <h2 className="row-title">{title}</h2>
          {badge && <span className="row-badge">{badge}</span>}
          <span className="row-count">({movies.length})</span>
        </div>

        {/* Scrolling navigation controls */}
        <div className="row-scroll-controls">
          <button
            className={`scroll-arrow-btn left ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            title="Scroll left"
          >
            ‹
          </button>
          <button
            className={`scroll-arrow-btn right ${!canScrollRight ? 'disabled' : ''}`}
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            title="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      <div
        className="posters-track"
        ref={rowRef}
        onScroll={checkScroll}
        onWheel={handleWheel}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="poster-track-item">
            <MovieCard
              movie={movie}
              onSelectMovie={onSelectMovie}
              isFavorite={favorites.includes(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
