import type { ContentItem } from '../../types/api';
import styles from './CarouselItem.module.css';

interface CarouselItemProps {
  movie: ContentItem;
  isFocused: boolean;
  onSelect: (movie: ContentItem) => void;
  ref?: React.Ref<HTMLLIElement>;
}

export default function CarouselItem({ movie, isFocused, onSelect, ref }: CarouselItemProps) {
  const className = `${styles.item}${isFocused ? ` ${styles['item--focused']}` : ''}`;

  return (
    <li
      ref={ref}
      className={className}
      data-testid={`carousel-item-${movie.id}`}
      data-focused={isFocused}
      onClick={() => onSelect(movie)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(movie);
      }}
      tabIndex={isFocused ? 0 : -1}
      role="option"
      aria-selected={isFocused}
    >
      <img
        className={styles.item__image}
        src={movie.images.artwork_portrait ?? ''}
        alt={movie.title}
        loading="lazy"
      />
    </li>
  );
}
