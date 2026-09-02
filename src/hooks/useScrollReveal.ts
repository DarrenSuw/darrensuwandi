'use client';
import { useEffect, useRef, useState } from 'react';

interface Options {
  threshold?: number;
}

/**
 * Returns `isVisible: true` the first time `ref` enters the viewport.
 * Disconnects after first trigger — never re-animates on re-entry.
 * Respects prefers-reduced-motion: reveals immediately if user prefers reduced motion.
 */
export function useScrollReveal<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.3 }: Options = {}
): boolean {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold }
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref, threshold]);

  return isVisible;
}
