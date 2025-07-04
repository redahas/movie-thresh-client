import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// Type declaration for Vanta
declare const VANTA: {
  FOG: (config: any) => {
    destroy: () => void;
  };
};

// Global cleanup for hot reloads
let globalVantaInstances: any[] = [];

// Cleanup function for hot reloads
const cleanupGlobalVantaInstances = () => {
  globalVantaInstances.forEach(instance => {
    try {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
      }
    } catch (error) {
      console.warn('Error destroying global Vanta instance:', error);
    }
  });
  globalVantaInstances = [];
};

// Add cleanup on hot reload
if (typeof window !== 'undefined') {
  (window as any).__VANTA_CLEANUP__ = cleanupGlobalVantaInstances;
}

// Development-only cleanup for hot reloads
if (typeof module !== 'undefined' && (module as any).hot) {
  (module as any).hot.dispose(() => {
    console.log('Hot reload detected, cleaning up Vanta instances...');
    cleanupGlobalVantaInstances();
  });
}

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
  const [isReady, setIsReady] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Memoize the config to prevent infinite re-renders
  const memoizedConfig = useMemo(() => config, [
    config.mouseControls,
    config.touchControls,
    config.gyroControls,
    config.minHeight,
    config.minWidth,
    config.scale,
    config.scaleMobile,
    config.speed,
    config.texture,
    config.zoom,
    config.highlightColor,
    config.midtoneColor,
    config.lowlightColor,
    config.baseColor,
    config.blurFactor,
  ]);

  useEffect(() => {
    if (!elementRef.current) return;

    // Reset state when config changes
    setIsReady(false);
    isInitializedRef.current = false;

    // Wait for VANTA to be available and initialize
    const initVanta = () => {
      if ((window as any).VANTA?.FOG && elementRef.current && !isInitializedRef.current) {
        try {
          console.log('Initializing Vanta effect...');

          // Clean up any existing instance first
          if (vantaRef.current && typeof vantaRef.current.destroy === 'function') {
            try {
              vantaRef.current.destroy();
            } catch (error) {
              console.warn('Error destroying previous Vanta instance:', error);
            }
          }

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
            ...memoizedConfig,
          });

          // Add to global instances for cleanup
          globalVantaInstances.push(vantaRef.current);

          isInitializedRef.current = true;
          console.log('Vanta effect initialized, waiting for smooth animation...');

          // Use requestAnimationFrame to wait for the next frame, then add a small delay
          requestAnimationFrame(() => {
            // Clear any existing timeout
            if (initTimeoutRef.current) {
              clearTimeout(initTimeoutRef.current);
            }

            // Add a small delay to allow the effect to initialize smoothly
            initTimeoutRef.current = setTimeout(() => {
              console.log('Vanta effect ready, showing...');
              setIsReady(true);
            }, 100); // Reduced from 300ms to 200ms
          });
        } catch (error) {
          console.error('Error initializing Vanta effect:', error);
          // Set ready anyway to prevent the component from being stuck
          setIsReady(true);
        }
      } else if (!isInitializedRef.current) {
        // Retry after a short delay
        setTimeout(initVanta, 100);
      }
    };

    initVanta();

    // Cleanup function
    return () => {
      console.log('Cleaning up Vanta effect...');

      // Clear the timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }

      // Clean up Vanta instance
      if (vantaRef.current) {
        try {
          if (typeof vantaRef.current.destroy === 'function') {
            vantaRef.current.destroy();
          }
          // Remove from global instances
          const index = globalVantaInstances.indexOf(vantaRef.current);
          if (index > -1) {
            globalVantaInstances.splice(index, 1);
          }
        } catch (error) {
          console.warn('Error destroying Vanta instance:', error);
        }
        vantaRef.current = null;
      }

      isInitializedRef.current = false;
      // Don't reset isReady here as it can cause issues during re-renders
    };
  }, [memoizedConfig]);

  return { elementRef, isReady };
}
