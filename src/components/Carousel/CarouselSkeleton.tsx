import styles from './CarouselSkeleton.module.css';

interface CarouselSkeletonProps {
  count?: number;
}

export default function CarouselSkeleton({ count = 8 }: CarouselSkeletonProps) {
  return (
    <section className={styles.skeleton} role="status" aria-label="Loading movies">
      <ul className={styles.skeleton__list}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={styles.skeleton__item} aria-hidden="true" />
        ))}
      </ul>
      <span className="sr-only">Loading content…</span>
    </section>
  );
}
