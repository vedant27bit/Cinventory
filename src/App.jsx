import {movies} from  './data/movies.js'
import { MovieCard } from './components/moviecard.jsx'
import './App.css'

function App() {

  return (
    <div>
      <h1>Movie Library</h1>

      {movies.map((movie) =>(
        <MovieCard
          key = {movie.id}
          movie={movie}
          />
      ))}

    </div>
      
  )
}

export default App
