import { create } from 'zustand';
import type { ContentItem, ApiResponse } from '../types/api';

const API_URL = 'https://eu.acc01.titanos.tv/v1/genres/1/contents?market=es&device=tv&locale=es&page=1&per_page=50&type=movie';

interface MoviesState {
  movies: ContentItem[];
  error: Error | null;
  /** Promise that resolves when data is available — consumed by React.use() for Suspense */
  moviesPromise: Promise<ContentItem[]> | null;
  focusedMovie: number;
  selectedMovie: ContentItem | null;
}

interface MoviesActions {
  fetchMovies: () => void;
  focusMovie: (index: number) => void;
  selectMovie: (movie: ContentItem | null) => void;
}

const fetchMoviesData = async (): Promise<ContentItem[]> => {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch movies (${res.status})`);
  }
  const data: ApiResponse = await res.json();
  return data.collection;
};

export const useMoviesStore = create<MoviesState & MoviesActions>()((set, get) => ({
  movies: [],
  error: null,
  moviesPromise: null,
  focusedMovie: 0,
  selectedMovie: null,

  fetchMovies: () => {
    // Avoid re-fetching if already loaded or in-flight
    if (get().moviesPromise) return;

    const promise = fetchMoviesData().then(
      (collection) => {
        set({ movies: collection, error: null });
        return collection;
      },
      (e) => {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error, moviesPromise: null });
        throw error;
      },
    );

    set({ moviesPromise: promise });
  },

  focusMovie: (index: number) => {
    const { movies } = get();
    set({ focusedMovie: Math.max(0, Math.min(index, movies.length - 1)) });
  },

  selectMovie: (movie: ContentItem | null) => {
    set({ selectedMovie: movie });
  },
}));
