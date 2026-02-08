import { useEffect, useRef } from 'react';

const failedUrls = new Set<string>();

export function usePreloadImages(sources: Array<string | null | undefined>) {
  const preloadersRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    preloadersRef.current = sources
      .filter((src): src is string => Boolean(src) && !failedUrls.has(src))
      .map((src) => {
        const img = new Image();
        img.onerror = () => failedUrls.add(src);
        img.src = src;
        return img;
      });

    return () => {
      preloadersRef.current.forEach((img) => { img.src = ''; });
      preloadersRef.current.length = 0;
    };
  }, [sources]);
}
