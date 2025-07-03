import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Type declaration for Vanta
declare const VANTA: {
  FOG: (config: any) => {
    destroy: () => void;
  };
};

interface VantaFogConfig {
  el: string | HTMLElement;
  THREE?: typeof THREE;
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

export function useVantaFog(config: Partial<VantaFogConfig> = {}) {
  const vantaRef = useRef<any>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Wait for VANTA to be available and initialize
    const initVanta = () => {
      if ((window as any).VANTA?.FOG && elementRef.current) {
        vantaRef.current = (window as any).VANTA.FOG({
          el: elementRef.current,
          THREE: THREE, // Pass the imported THREE instance
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
