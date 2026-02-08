import { create } from 'zustand';
import type { ContentItem, ApiResponse } from '../types/api';

const API_URL = 'https://eu.acc01.titanos.tv/v1/genres/1/contents?market=es&device=tv&locale=es&page=1&per_page=50&type=movie';

interface MoviesState {
  movies: ContentItem[];
  error: Error | null;
  focusedMovie: number;
  selectedMovie: ContentItem | null;
}

interface MoviesActions {
  fetchMovies: () => Promise<void>;
  focusMovie: (index: number) => void;
  selectMovie: (movie: ContentItem | null) => void;
}

export const useMoviesStore = create<MoviesState & MoviesActions>()((set, get) => ({
  movies: [],
  error: null,
  focusedMovie: 0,
  selectedMovie: null,

  fetchMovies: async () => {
    try {
      const res = await fetch(API_URL);
      const data: ApiResponse = await res.json();
      set({ movies: data.collection, error: null });
    } catch (e) {
      set({ error: e instanceof Error ? e : new Error(String(e)) });
    }
  },

  focusMovie: (index: number) => {
    const { movies } = get();
    set({ focusedMovie: Math.max(0, Math.min(index, movies.length - 1)) });
  },

  selectMovie: (movie: ContentItem | null) => {
    set({ selectedMovie: movie });
  },
}));
