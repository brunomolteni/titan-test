import { useEffect, useRef, useCallback } from 'react';
import type { ContentItem } from '../../types/api';
import CarouselItem from './CarouselItem';
import styles from './Carousel.module.css';

interface CarouselProps {
  movies: ContentItem[];
  focusedMovie: number;
  onFocusChange: (index: number) => void;
  onSelect: (movie: ContentItem) => void;
}

export default function Carousel({ movies, focusedMovie, onFocusChange, onSelect }: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  const setItemRef = useCallback((index: number) => (el: HTMLLIElement | null) => {
    if (el) {
      itemRefs.current.set(index, el);
    } else {
      itemRefs.current.delete(index);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onFocusChange(focusedMovie + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onFocusChange(focusedMovie - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedMovie, onFocusChange]);

  // Smooth scroll to pin focused item leftmost
  useEffect(() => {
    const el = itemRefs.current.get(focusedMovie);
    if (!el || !listRef.current) return;
    const padding = parseFloat(getComputedStyle(listRef.current).paddingLeft) || 0;
    listRef.current.scrollTo({ left: el.offsetLeft - padding, behavior: 'smooth' });
  }, [focusedMovie]);

  if (movies.length === 0) return null;

  return (
    <section className={styles.carousel} role="listbox" aria-label="Movies carousel">
      <ul className={styles.carousel__list} ref={listRef}>
        {movies.map((movie, index) => (
          <CarouselItem
            key={movie.id}
            ref={setItemRef(index)}
            movie={movie}
            isFocused={index === focusedMovie}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </section>
  );
}
