import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "~/hooks/useMutation";
import { useRouter } from "@tanstack/react-router";
import { Settings, Moon, Sun, Monitor, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Toggle, RatingSlider } from "~/components/form";
import { UPDATE_USER_PREFERENCES } from "~/graphql/mutations";
import { GET_USER } from "~/graphql/queries";
import { graphqlClient } from "~/lib/graphql-client";
import { useUser } from "~/hooks/useUser";
import type { UpdateUserPreferencesInput } from "~/schema/__generated__/types.generated";
import { toast } from "sonner";
import { createAuthenticatedClient } from "~/lib/graphql-client";
import { getSessionTokenFn } from "~/routes/_authed";
import { useServerFn } from "@tanstack/react-start";
import { usePreferences } from "~/contexts/PreferencesContext";
import { saveLocalSettings } from "~/utils/localStorage";
import * as Sentry from "@sentry/react";

export const SettingsMenu = forwardRef<
  { setIsOpen: (open: boolean) => void },
  {}
>((props, ref) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { preferences, updatePreferences } = usePreferences();

  // Initialize settings from global preferences
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    preferences.theme,
  );
  const [imdbThreshold, setImdbThreshold] = useState(preferences.imdbThreshold);
  const [rottenTomatoesThreshold, setRottenTomatoesThreshold] = useState(
    preferences.rottenTomatoesThreshold,
  );
  const [metacriticThreshold, setMetacriticThreshold] = useState(
    preferences.metacriticThreshold,
  );
  const [smoothScrollingEnabled, setSmoothScrollingEnabled] = useState(
    preferences.smoothScrollingEnabled,
  );

  // Sync local state with global preferences when they change
  useEffect(() => {
    setTheme(preferences.theme);
    setImdbThreshold(preferences.imdbThreshold);
    setRottenTomatoesThreshold(preferences.rottenTomatoesThreshold);
    setMetacriticThreshold(preferences.metacriticThreshold);
    setSmoothScrollingEnabled(preferences.smoothScrollingEnabled);

    // Update previous values to prevent unnecessary mutations
    previousValuesRef.current = {
      theme: preferences.theme,
      imdbThreshold: preferences.imdbThreshold,
      rottenTomatoesThreshold: preferences.rottenTomatoesThreshold,
      metacriticThreshold: preferences.metacriticThreshold,
      smoothScrollingEnabled: preferences.smoothScrollingEnabled,
    };
  }, [preferences]);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mutationRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);
  const previousValuesRef = useRef({
    theme: preferences.theme,
    imdbThreshold: preferences.imdbThreshold,
    rottenTomatoesThreshold: preferences.rottenTomatoesThreshold,
    metacriticThreshold: preferences.metacriticThreshold,
    smoothScrollingEnabled: preferences.smoothScrollingEnabled,
  });

  // Server function to get session token
  const getSessionToken = useServerFn(getSessionTokenFn);

  // Function to update preferences (database for authenticated users, localStorage for others)
  const updatePreferencesMutation = useMutation<
    UpdateUserPreferencesInput,
    any
  >({
    fn: async (preferences: UpdateUserPreferencesInput) => {
      if (user) {
        // Get the session token from server
        const sessionResult = await getSessionToken();

        if (sessionResult.error) {
          throw new Error(
            sessionResult.message || "Failed to get session token",
          );
        }
        // Create authenticated client
        const authenticatedClient = createAuthenticatedClient(
          sessionResult.token,
        );

        try {
          const result = await authenticatedClient.request(
            UPDATE_USER_PREFERENCES,
            {
              preferences,
            },
          );
          return result;
        } catch (error) {
          console.error("Failed to update preferences:", error);

          // Log error to Sentry
          Sentry.captureException(error, {
            tags: {
              component: "SettingsMenu",
              operation: "updatePreferences",
              userType: "authenticated",
            },
            extra: {
              preferences,
              userId: user?.id,
              error: error instanceof Error ? error.message : String(error),
            },
          });

          toast.error("Failed to update preferences");
          throw error;
        }
      } else {
        // Unauthenticated user - save to localStorage
        console.log("User not authenticated, saving to localStorage");
        try {
          saveLocalSettings(preferences);
          return { success: true };
        } catch (error) {
          console.error("Failed to save preferences to localStorage:", error);

          // Log error to Sentry
          Sentry.captureException(error, {
            tags: {
              component: "SettingsMenu",
              operation: "updatePreferences",
              userType: "unauthenticated",
              storage: "localStorage",
            },
            extra: {
              preferences,
              error: error instanceof Error ? error.message : String(error),
            },
          });

          throw error;
        }
      }
    },
    onSuccess: ({ data }) => {
      // Update global preferences
      updatePreferences({
        theme,
        imdbThreshold,
        rottenTomatoesThreshold,
        metacriticThreshold,
        smoothScrollingEnabled,
      });

      if (user) {
        // Invalidate the route to refetch user data with updated preferences
        router.invalidate();
      } else {
        console.log("Preferences saved to localStorage");
      }
    },
  });

  // Store mutation in ref to avoid dependency issues
  mutationRef.current = updatePreferencesMutation;

  // Debounced function to update preferences
  const debouncedUpdatePreferences = useCallback(
    (preferences: UpdateUserPreferencesInput) => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        if (mutationRef.current?.mutate) {
          const mutationResolution = mutationRef.current.mutate(preferences);
          toast.promise(mutationResolution, {
            loading: "Saving...",
            success: "Preferences saved",
            error: "Error saving preferences",
          });
        } else {
          console.error("Mutation ref or mutate function not available");
        }
      }, 1000); // 1 second delay
    },
    [], // No dependencies
  );

  // Effect to update preferences when any setting changes
  useEffect(() => {
    // Skip the first render to avoid calling mutation on mount
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    // Check if any values have actually changed
    const currentValues = {
      theme,
      imdbThreshold,
      rottenTomatoesThreshold,
      metacriticThreshold,
      smoothScrollingEnabled,
    };

    const hasChanges = Object.keys(currentValues).some(
      (key) =>
        currentValues[key as keyof typeof currentValues] !==
        previousValuesRef.current[
          key as keyof typeof previousValuesRef.current
        ],
    );

    if (!hasChanges) {
      return;
    }

    // Update previous values
    previousValuesRef.current = currentValues;

    const preferences: UpdateUserPreferencesInput = {
      theme,
      imdbThreshold,
      rottenTomatoesThreshold,
      metacriticThreshold,
      smoothScrollingEnabled,
    };

    debouncedUpdatePreferences(preferences);
  }, [
    theme,
    imdbThreshold,
    rottenTomatoesThreshold,
    metacriticThreshold,
    smoothScrollingEnabled,
    debouncedUpdatePreferences,
  ]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Check for settings parameter on mount
  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("settings") === "true") {
        setIsOpen(true);
        // Remove the settings parameter from URL
        urlParams.delete("settings");
        const newUrl =
          window.location.pathname +
          (urlParams.toString() ? `?${urlParams.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      // Get the current scrollbar width to prevent layout shift
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      // Add padding to compensate for scrollbar width
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      // Add a class to prevent scrolling
      document.documentElement.classList.add("no-scroll");
    } else {
      // Remove padding compensation
      document.body.style.paddingRight = "";

      // Remove the no-scroll class
      document.documentElement.classList.remove("no-scroll");
    }

    return () => {
      // Cleanup on unmount
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("no-scroll");
    };
  }, [isOpen]);

  // Handle wheel events on the scroll area
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  // Expose setIsOpen method to parent component
  useImperativeHandle(ref, () => ({
    setIsOpen,
  }));

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Open settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[400px] sm:w-[540px] flex flex-col h-full gap-0"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your movie browsing experience
          </SheetDescription>
        </SheetHeader>
        <Separator className="m-0 p-0" />

        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          onWheel={handleWheel}
        >
          <div className="flex flex-col gap-6 p-4">
            {/* Rating Thresholds */}
            <div className="space-y-4">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">
                  Rating Thresholds
                </Label>
                <p className="text-sm text-muted-foreground">
                  Set minimum ratings for movie recommendations
                </p>
              </div>

              <div className="space-y-4">
                <RatingSlider
                  label="IMDb Rating"
                  value={imdbThreshold}
                  onChange={setImdbThreshold}
                  min={0}
                  max={10}
                  step={0.1}
                />

                <RatingSlider
                  label="Rotten Tomatoes"
                  value={rottenTomatoesThreshold}
                  onChange={setRottenTomatoesThreshold}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                />

                <RatingSlider
                  label="Metacritic"
                  value={metacriticThreshold}
                  onChange={setMetacriticThreshold}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>
            </div>

            <Separator />

            {/* Smooth Scrolling */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Smooth Scrolling
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth scrolling animations
                  </p>
                </div>
                <Toggle
                  checked={smoothScrollingEnabled}
                  onCheckedChange={setSmoothScrollingEnabled}
                />
              </div>
            </div>

            <Separator />

            {/* Theme Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});
