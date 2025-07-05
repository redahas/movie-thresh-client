import ColorThief from 'colorthief';
import { useVantaStore, defaultColors } from '../stores/vantaStore';

interface ColorPalette {
  highlightColor?: string;
  midtoneColor?: string;
  lowlightColor?: string;
  baseColor?: string;
}

// Convert RGB array to hex color
function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Convert RGB array to HSL for better color manipulation
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// Convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 1 / 6) {
    r = c;
    g = x;
    b = 0;
  } else if (1 / 6 <= h && h < 1 / 3) {
    r = x;
    g = c;
    b = 0;
  } else if (1 / 3 <= h && h < 1 / 2) {
    r = 0;
    g = c;
    b = x;
  } else if (1 / 2 <= h && h < 2 / 3) {
    r = 0;
    g = x;
    b = c;
  } else if (2 / 3 <= h && h < 5 / 6) {
    r = x;
    g = 0;
    b = c;
  } else if (5 / 6 <= h && h <= 1) {
    r = c;
    g = 0;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

// Generate a color palette from a base color
function generatePalette(baseColor: [number, number, number]): ColorPalette {
  const [h, s, l] = rgbToHsl(...baseColor);

  // Create variations for the palette
  const highlightColor = rgbToHex(...hslToRgb(h, Math.min(s + 20, 100), Math.min(l + 30, 90)));
  const midtoneColor = rgbToHex(...hslToRgb(h, s, l));
  const lowlightColor = rgbToHex(...hslToRgb(h, Math.max(s - 10, 0), Math.max(l - 20, 10)));
  const baseColorHex = rgbToHex(...hslToRgb(h, Math.max(s - 20, 0), Math.max(l - 40, 5)));

  return {
    highlightColor,
    midtoneColor,
    lowlightColor,
    baseColor: baseColorHex,
  };
}

// Extract colors from an image and update the global Vanta store
export async function updateVantaColorsFromImage(imageUrl: string): Promise<void> {
  try {
    const colorThief = new ColorThief();

    // Create a temporary image element
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        // Get the dominant color
        const dominantColor = colorThief.getColor(img);

        // Generate palette from dominant color
        const palette = generatePalette(dominantColor);

        // Update the global store
        const { updateColors } = useVantaStore.getState();
        updateColors(palette);

        console.log('Vanta colors updated from image:', palette);
      } catch (error) {
        console.warn('Error extracting colors from image:', error);
      }
    };

    img.onerror = () => {
      console.warn('Failed to load image for color extraction:', imageUrl);
    };

    img.src = imageUrl;
  } catch (error) {
    console.error('Error updating Vanta colors from image:', error);
  }
}

// Reset to default colors
export function resetVantaColors(): void {
  const { updateColors } = useVantaStore.getState();
  updateColors({
    ...defaultColors
  });
}
