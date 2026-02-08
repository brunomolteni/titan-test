import styles from './CarouselError.module.css';

interface CarouselErrorProps {
  error: Error;
  onRetry?: () => void;
}

export default function CarouselError({ error, onRetry }: CarouselErrorProps) {
  return (
    <section className={styles.error} role="alert" aria-label="Error loading movies">
      <span className={styles.error__icon} aria-hidden="true">⚠</span>
      <h2 className={styles.error__title}>Something went wrong</h2>
      <p className={styles.error__message}>{error.message}</p>
      {onRetry && (
        <button className={styles.error__button} onClick={onRetry} type="button">
          Try again
        </button>
      )}
    </section>
  );
}
