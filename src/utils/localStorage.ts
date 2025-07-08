// Local storage keys
const SETTINGS_KEY = 'movie-thresh-settings';

// Default settings
export const DEFAULT_SETTINGS = {
  theme: 'system' as 'light' | 'dark' | 'system',
  imdbThreshold: 6.0,
  rottenTomatoesThreshold: 60,
  metacriticThreshold: 6.0,
  smoothScrollingEnabled: true,
};

export type LocalSettings = {
  theme: 'light' | 'dark' | 'system';
  imdbThreshold: number;
  rottenTomatoesThreshold: number;
  metacriticThreshold: number;
  smoothScrollingEnabled: boolean;
};

// Get settings from localStorage
export function getLocalSettings(): LocalSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
  }

  return DEFAULT_SETTINGS;
}

// Save settings to localStorage
export function saveLocalSettings(settings: any): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const current = getLocalSettings();
    // Filter and convert settings to match LocalSettings type
    const filteredSettings: Partial<LocalSettings> = {};

    if (settings.theme && ['light', 'dark', 'system'].includes(settings.theme)) {
      filteredSettings.theme = settings.theme as 'light' | 'dark' | 'system';
    }
    if (typeof settings.imdbThreshold === 'number') {
      filteredSettings.imdbThreshold = settings.imdbThreshold;
    }
    if (typeof settings.rottenTomatoesThreshold === 'number') {
      filteredSettings.rottenTomatoesThreshold = settings.rottenTomatoesThreshold;
    }
    if (typeof settings.metacriticThreshold === 'number') {
      filteredSettings.metacriticThreshold = settings.metacriticThreshold;
    }
    if (typeof settings.smoothScrollingEnabled === 'boolean') {
      filteredSettings.smoothScrollingEnabled = settings.smoothScrollingEnabled;
    }

    const updated = { ...current, ...filteredSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}

// Clear settings from localStorage
export function clearLocalSettings(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing settings from localStorage:', error);
  }
}
