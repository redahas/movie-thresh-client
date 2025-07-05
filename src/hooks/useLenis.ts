import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface UseLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal';
  touchMultiplier?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  smoothTouch?: boolean;
  infinite?: boolean;
}

export function useLenis(options: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize on the client side
    if (typeof window === 'undefined') return;

    // Initialize Lenis with default options
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      touchMultiplier: 2,
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      infinite: false,
      ...options,
    });

    // Make Lenis globally accessible for other components
    (window as any).lenis = lenisRef.current;

    // RAF loop for Lenis - use a more compatible approach
    let rafId: number;
    function raf(time: number) {
      lenisRef.current?.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [options]);

  return lenisRef.current;
}
