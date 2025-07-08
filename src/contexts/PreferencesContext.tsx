import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  DEFAULT_SETTINGS,
  getLocalSettings,
  clearLocalSettings,
} from "~/utils/localStorage";
import type { LocalSettings } from "~/utils/localStorage";

interface PreferencesContextType {
  preferences: LocalSettings;
  updatePreferences: (newPreferences: Partial<LocalSettings>) => void;
  resetToDefaults: () => void;
  loadUserPreferences: (userPreferences: Record<string, any>) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

export function PreferencesProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: any;
}) {
  const [preferences, setPreferences] =
    useState<LocalSettings>(DEFAULT_SETTINGS);

  // Load preferences on mount based on whether we have user data
  useEffect(() => {
    if (initialUser) {
      // User is authenticated - load their preferences
      loadUserPreferences(initialUser.preferences || {});
    } else {
      // No user - load from localStorage
      const localPrefs = getLocalSettings();
      setPreferences(localPrefs);
    }
  }, [initialUser]);

  const updatePreferences = useCallback(
    (newPreferences: Partial<LocalSettings>) => {
      setPreferences((prev) => ({ ...prev, ...newPreferences }));
    },
    [],
  );

  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_SETTINGS);
    clearLocalSettings();
  }, []);

  const loadUserPreferences = useCallback(
    (userPreferences: Record<string, any>) => {
      // Convert user preferences to LocalSettings format
      const convertedPreferences: LocalSettings = {
        theme:
          (userPreferences.theme as "light" | "dark" | "system") ||
          DEFAULT_SETTINGS.theme,
        imdbThreshold:
          typeof userPreferences.imdbThreshold === "number"
            ? userPreferences.imdbThreshold
            : DEFAULT_SETTINGS.imdbThreshold,
        rottenTomatoesThreshold:
          typeof userPreferences.rottenTomatoesThreshold === "number"
            ? userPreferences.rottenTomatoesThreshold
            : DEFAULT_SETTINGS.rottenTomatoesThreshold,
        metacriticThreshold:
          typeof userPreferences.metacriticThreshold === "number"
            ? userPreferences.metacriticThreshold
            : DEFAULT_SETTINGS.metacriticThreshold,
        smoothScrollingEnabled:
          typeof userPreferences.smoothScrollingEnabled === "boolean"
            ? userPreferences.smoothScrollingEnabled
            : DEFAULT_SETTINGS.smoothScrollingEnabled,
      };

      setPreferences(convertedPreferences);
    },
    [],
  );

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences,
        resetToDefaults,
        loadUserPreferences,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
