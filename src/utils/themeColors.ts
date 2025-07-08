interface ColorPalette {
  highlightColor?: string;
  midtoneColor?: string;
  lowlightColor?: string;
  baseColor?: string;
}

// Light theme colors
export const lightThemeColors: ColorPalette = {
  highlightColor: "#e2e8f0",
  midtoneColor: "#cbd5e1",
  lowlightColor: "#94a3b8",
  baseColor: "#f8fafc",
};

// Dark theme colors (your existing default colors)
export const darkThemeColors: ColorPalette = {
  highlightColor: "#43536d",
  midtoneColor: "#43536d",
  lowlightColor: "#2e3c54",
  baseColor: "#030719",
};

// Get theme-appropriate colors
export function getThemeColors(isDark: boolean): ColorPalette {
  return isDark ? darkThemeColors : lightThemeColors;
}

// Adjust existing colors for theme
export function adjustColorsForTheme(colors: ColorPalette, isDark: boolean): ColorPalette {
  if (isDark) {
    return colors; // Keep original colors for dark theme
  } else {
    // Adjust colors for light theme - you can customize this logic
    return {
      highlightColor: colors.highlightColor,
      midtoneColor: colors.midtoneColor,
      lowlightColor: colors.lowlightColor,
      baseColor: colors.baseColor,
    };
  }
}
