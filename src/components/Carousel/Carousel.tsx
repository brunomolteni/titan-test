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

// Ease-out cubic for natural deceleration
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Transform-based smooth scroll (runs on compositor thread)
const animateTransform = (
  element: HTMLElement,
  from: number,
  to: number,
  duration: number,
): (() => void) => {
  const distance = to - from;
  if (Math.abs(distance) < 0.5) {
    element.style.transform = `translateX(${-to}px)`;
    return () => {};
  }

  const startTime = performance.now();
  let rafId = 0;
  let cancelled = false;

  const tick = (now: number) => {
    if (cancelled) return;
    const progress = Math.min((now - startTime) / duration, 1);
    const current = from + distance * easeOutCubic(progress);
    element.style.transform = `translateX(${-current}px)`;

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    }
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
};

export default function Carousel({ movies, focusedMovie, onFocusChange, onSelect }: CarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());
  const lastNavTime = useRef(0);
  const lastScrollTime = useRef(0);
  const offsetRef = useRef(0);
  const cancelRef = useRef<(() => void) | null>(null);

  const THROTTLE_MS = 150;
  const DURATION_DEFAULT = 400;
  const DURATION_RAPID = 220;

  const setItemRef = useCallback(
    (index: number) => (el: HTMLLIElement | null) => {
      if (el) itemRefs.current.set(index, el);
      else itemRefs.current.delete(index);
    },
    [],
  );

  // Keyboard navigation (throttled)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const now = Date.now();
      if (now - lastNavTime.current < THROTTLE_MS) return;
      lastNavTime.current = now;
      e.preventDefault();
      onFocusChange(focusedMovie + (e.key === 'ArrowRight' ? 1 : -1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedMovie, onFocusChange]);

  // Animate to focused item using translateX
  useEffect(() => {
    const item = itemRefs.current.get(focusedMovie);
    if (!item || !listRef.current) return;

    const now = Date.now();
    const gap = now - lastScrollTime.current;
    lastScrollTime.current = now;
    const duration = gap < 300 ? DURATION_RAPID : DURATION_DEFAULT;

    const padding = parseFloat(getComputedStyle(listRef.current).paddingLeft) || 0;
    const target = item.offsetLeft - padding;

    if (cancelRef.current) cancelRef.current();
    cancelRef.current = animateTransform(listRef.current, offsetRef.current, target, duration);
    offsetRef.current = target;
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
