export function MovieCard({movie}){
    return(
        <div>
            <img
        src={movie.poster}
        alt={movie.title}
            />
            <h2>{movie.title}</h2>

             <p>{movie.genre}</p>

             <p>⭐ IMDb:{movie.imdb}</p>

             <p>👥 User Rating:{movie.rating}</p>

             <p>{movie.year}</p>
             
             <p>{movie.description}</p>
        </div>

       
    );
}