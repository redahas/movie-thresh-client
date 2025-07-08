import { useEffect, useState } from "react";
import { usePreferences } from "~/contexts/PreferencesContext";

export function useTheme() {
  const { preferences } = usePreferences();
  const [isDark, setIsDark] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

    // Effect to handle theme changes
  useEffect(() => {
    setIsClient(true);

    const updateTheme = () => {
      if (preferences.theme === "dark") {
        setIsDark(true);
      } else if (preferences.theme === "light") {
        setIsDark(false);
      } else if (preferences.theme === "system") {
        // Check system preference
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setIsDark(mediaQuery.matches);

        // Listen for changes
        const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
      }
    };

    updateTheme();
    // Mark as initialized after theme determination
    setIsInitialized(true);
  }, [preferences.theme]);

  // Effect to handle initial load when preferences are already available
  useEffect(() => {
    if (isClient && preferences.theme && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isClient, preferences.theme, isInitialized]);

  // Fallback: if we're on client and have been here for a while, force initialization
  useEffect(() => {
    if (isClient && !isInitialized) {
      const timer = setTimeout(() => {
        setIsInitialized(true);
      }, 1000); // 1 second timeout

      return () => clearTimeout(timer);
    }
  }, [isClient, isInitialized]);

  return {
    isDark: isClient ? isDark : false, // Default to false during SSR
    theme: preferences.theme,
    isClient,
    isInitialized,
  };
}
