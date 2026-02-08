import { useRef, useEffect, useCallback } from 'react';

interface UseSwipeGestureOptions {
  /**
   * Minimum distance in pixels to trigger a swipe
   * @default 50
   */
  threshold?: number;
  /**
   * Maximum vertical distance allowed for a horizontal swipe
   * Prevents conflicts with vertical scrolling
   * @default 30
   */
  maxVerticalDistance?: number;
  /**
   * Handler to call when a left swipe is detected (swiping left = moving to next item)
   */
  onSwipeLeft?: () => void;
  /**
   * Handler to call when a right swipe is detected (swiping right = moving to previous item)
   */
  onSwipeRight?: () => void;
  /**
   * Throttle delay in milliseconds to prevent rapid swipes
   * @default 150
   */
  throttleMs?: number;
  /**
   * Whether swipe detection is enabled
   * @default true
   */
  enabled?: boolean;
}

export interface SwipeHandlers {
  /**
   * Handler for swipe left gesture (call this to navigate to next)
   */
  handleSwipeLeft: () => void;
  /**
   * Handler for swipe right gesture (call this to navigate to previous)
   */
  handleSwipeRight: () => void;
}

/**
 * Hook to detect swipe gestures on touch devices with built-in throttling
 * 
 * @example
 * ```tsx
 * const { ref, handleSwipeLeft, handleSwipeRight } = useSwipeGesture({
 *   onSwipeLeft: () => goToNext(),
 *   onSwipeRight: () => goToPrev(),
 *   threshold: 50,
 *   throttleMs: 150,
 * });
 * 
 * return <div ref={ref}>...</div>;
 * ```
 */
export function useSwipeGesture({
  threshold = 50,
  maxVerticalDistance = 30,
  onSwipeLeft,
  onSwipeRight,
  throttleMs = 150,
  enabled = true,
}: UseSwipeGestureOptions = {}): { ref: (element: HTMLElement | null) => void } & SwipeHandlers {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const lastSwipeTimeRef = useRef(0);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || e.touches.length !== 1) return;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [enabled],
  );

  // Throttled handlers
  const handleSwipeLeft = useCallback(() => {
    const now = Date.now();
    if (now - lastSwipeTimeRef.current < throttleMs) return;
    lastSwipeTimeRef.current = now;
    onSwipeLeft?.();
  }, [throttleMs, onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    const now = Date.now();
    if (now - lastSwipeTimeRef.current < throttleMs) return;
    lastSwipeTimeRef.current = now;
    onSwipeRight?.();
  }, [throttleMs, onSwipeRight]);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !touchStartRef.current || e.changedTouches.length !== 1) {
        touchStartRef.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Reset touch start
      touchStartRef.current = null;

      // Check if it's a horizontal swipe (not vertical scroll)
      if (absDeltaY > maxVerticalDistance && absDeltaY > absDeltaX) {
        // Vertical movement dominates - likely a scroll, ignore
        return;
      }

      // Check if swipe distance meets threshold
      if (absDeltaX < threshold) {
        // Not enough horizontal movement
        return;
      }

      // Determine swipe direction and trigger handler
      if (deltaX > 0) {
        // Swiped right (towards right = previous item)
        handleSwipeRight();
      } else {
        // Swiped left (towards left = next item)
        handleSwipeLeft();
      }
    },
    [enabled, threshold, maxVerticalDistance, handleSwipeLeft, handleSwipeRight],
  );

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  const setRef = useCallback(
    (element: HTMLElement | null) => {
      // Clean up previous element listeners
      const prevElement = elementRef.current;
      if (prevElement) {
        prevElement.removeEventListener('touchstart', handleTouchStart, { passive: true });
        prevElement.removeEventListener('touchend', handleTouchEnd, { passive: true });
        prevElement.removeEventListener('touchcancel', handleTouchCancel, { passive: true });
      }

      elementRef.current = element;

      // Add listeners to new element
      if (element && enabled) {
        element.addEventListener('touchstart', handleTouchStart, { passive: true });
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
        element.addEventListener('touchcancel', handleTouchCancel, { passive: true });
      }
    },
    [enabled, handleTouchStart, handleTouchEnd, handleTouchCancel],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const element = elementRef.current;
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchcancel', handleTouchCancel);
      }
    };
  }, [handleTouchStart, handleTouchEnd, handleTouchCancel]);

  return {
    ref: setRef,
    handleSwipeLeft,
    handleSwipeRight,
  };
}
