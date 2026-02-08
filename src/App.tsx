import { useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useMoviesStore } from './stores/useMoviesStore';
import { usePreloadImages } from './hooks/usePreloadImages';
import Carousel from './components/Carousel/Carousel';
import styles from './App.module.css';

export default function App() {
  const { movies, focusedMovie, fetchMovies, focusMovie, selectMovie } =
    useMoviesStore(useShallow((s) => ({
      movies: s.movies,
      focusedMovie: s.focusedMovie,
      fetchMovies: s.fetchMovies,
      focusMovie: s.focusMovie,
      selectMovie: s.selectMovie,
    })));

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  usePreloadImages(movies.map((movie) => movie.images.artwork_portrait));

  return (
    <main className={styles.app}>
      <h1 className={styles.app__title}>TitanTest</h1>
      <div className={styles.app__carousel}>
        <Carousel
        movies={movies}
        focusedMovie={focusedMovie}
          onFocusChange={focusMovie}
          onSelect={selectMovie}
        />
      </div>
    </main>
  );
}
