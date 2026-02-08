import styles from './CarouselEmpty.module.css';

interface CarouselEmptyProps {
  message?: string;
}

export default function CarouselEmpty({
  message = 'No movies available right now. Check back later.',
}: CarouselEmptyProps) {
  return (
    <section className={styles.empty} role="status" aria-label="No movies available">
      <span className={styles.empty__icon} aria-hidden="true">🎬</span>
      <h2 className={styles.empty__title}>Nothing to show</h2>
      <p className={styles.empty__message}>{message}</p>
    </section>
  );
}
