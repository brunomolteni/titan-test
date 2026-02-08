import { useState } from 'react';
import type { ContentItem } from '../../types/api';
import styles from './CarouselItem.module.css';

interface CarouselItemProps {
  movie: ContentItem;
  isFocused: boolean;
  onSelect: (movie: ContentItem) => void;
  ref?: React.Ref<HTMLLIElement>;
}

// SVG placeholder with 2:3 aspect ratio (160x240px equivalent)
const PLACEHOLDER_IMAGE = `data:image/svg+xml;base64,${btoa(
  `<svg width="160" height="240" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#2a2a2a;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="160" height="240" fill="url(#grad)"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#666" text-anchor="middle" dominant-baseline="middle">No Image</text>
  </svg>`
)}`;

export default function CarouselItem({ movie, isFocused, onSelect, ref }: CarouselItemProps) {
  const [imageError, setImageError] = useState(false);
  const className = `${styles.item}${isFocused ? ` ${styles['item--focused']}` : ''}`;
  const imageSrc = imageError || !movie.images.artwork_portrait 
    ? PLACEHOLDER_IMAGE 
    : movie.images.artwork_portrait;

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
      <div className={styles.item__wrapper}>
        <img
          className={styles.item__image}
          src={imageSrc}
          alt={movie.title}
          loading="lazy"
          onError={() => setImageError(true)}
        />
        <div className={styles.item__highlight} aria-hidden="true" />
      </div>
    </li>
  );
}
