import { Suspense, use, useEffect } from 'react';
import { useShallow } from 'zustand/shallow';
import { useMoviesStore } from './stores/useMoviesStore';
import { usePreloadImages } from './hooks/usePreloadImages';
import ErrorBoundary from './components/ErrorBoundary';
import Carousel from './components/Carousel/Carousel';
import CarouselSkeleton from './components/Carousel/CarouselSkeleton';
import CarouselError from './components/Carousel/CarouselError';
import CarouselEmpty from './components/Carousel/CarouselEmpty';
import styles from './App.module.css';

function MoviesCarousel() {
  const { movies, moviesPromise, focusedMovie, focusMovie, selectMovie } =
    useMoviesStore(useShallow((s) => ({
      movies: s.movies,
      moviesPromise: s.moviesPromise,
      focusedMovie: s.focusedMovie,
      focusMovie: s.focusMovie,
      selectMovie: s.selectMovie,
    })));

  // Suspend until data is available
  if (moviesPromise && movies.length === 0) {
    use(moviesPromise);
  }

  usePreloadImages(movies.map((movie) => movie.images.artwork_portrait));

  if (movies.length === 0) {
    return <CarouselEmpty />;
  }

  return (
    <Carousel
      movies={movies}
      focusedMovie={focusedMovie}
      onFocusChange={focusMovie}
      onSelect={selectMovie}
    />
  );
}

export default function App() {
  const fetchMovies = useMoviesStore((s) => s.fetchMovies);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleRetry = () => {
    // Reset the store so fetchMovies can re-trigger
    useMoviesStore.setState({ moviesPromise: null, error: null, movies: [] });
    fetchMovies();
  };

  return (
    <main className={styles.app}>
      <h1 className={styles.app__title}>TitanTest</h1>
      <div className={styles.app__carousel}>
        <ErrorBoundary
          fallback={(error, reset) => (
            <CarouselError
              error={error}
              onRetry={() => {
                reset();
                handleRetry();
              }}
            />
          )}
        >
          <Suspense fallback={<CarouselSkeleton />}>
            <MoviesCarousel />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}
