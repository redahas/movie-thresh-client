import { useEffect, useRef } from 'react';

interface VantaFogConfig {
  el: string | HTMLElement;
  mouseControls?: boolean;
  touchControls?: boolean;
  gyroControls?: boolean;
  minHeight?: number;
  minWidth?: number;
  scale?: number;
  scaleMobile?: number;
  speed?: number;
  texture?: string;
  zoom?: number;
  highlightColor?: string;
  midtoneColor?: string;
  lowlightColor?: string;
  baseColor?: string;
  blurFactor?: number;
}

declare global {
  interface Window {
    VANTA: {
      FOG: (config: VantaFogConfig) => {
        destroy: () => void;
      };
    };
  }
}

export function useVantaFog(config: Partial<VantaFogConfig> = {}) {
  const vantaRef = useRef<any>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Wait for VANTA to be available
    const initVanta = () => {
      if (window.VANTA?.FOG && elementRef.current) {
        vantaRef.current = window.VANTA.FOG({
          el: elementRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          speed: 1.00,
          texture: "https://www.vantajs.com/gallery/noise.png",
          zoom: 0.8,
          ...config,
        });
      } else {
        // Retry after a short delay
        setTimeout(initVanta, 100);
      }
    };

    initVanta();

    // Cleanup function
    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, [config]);

  return elementRef;
} 