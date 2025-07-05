import { useState, useEffect, useRef, useCallback } from "react";
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

export function SettingsMenu() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize settings from user preferences or defaults
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    (user?.preferences?.theme as "light" | "dark" | "system") || "system",
  );

  // Rating threshold states
  const [imdbThreshold, setImdbThreshold] = useState(
    user?.preferences?.imdbThreshold ?? 6.0,
  );
  const [rottenTomatoesThreshold, setRottenTomatoesThreshold] = useState(
    user?.preferences?.rottenTomatoesThreshold ?? 60,
  );
  const [metacriticThreshold, setMetacriticThreshold] = useState(
    user?.preferences?.metacriticThreshold ?? 6.0,
  );

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mutationRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);

  // Server function to get session token
  const getSessionToken = useServerFn(getSessionTokenFn);

  // GraphQL mutation for updating preferences
  const updatePreferencesMutation = useMutation<
    UpdateUserPreferencesInput,
    any
  >({
    fn: async (preferences: UpdateUserPreferencesInput) => {
      console.log("Mutation function called with:", preferences);

      // Get the session token from server
      const sessionResult = await getSessionToken();

      if (sessionResult.error) {
        throw new Error(sessionResult.message || "Failed to get session token");
      }

      console.log("Session token obtained from server");

      console.log("Creating authenticated client...");
      // Create authenticated client
      const authenticatedClient = createAuthenticatedClient(
        sessionResult.token,
      );
      console.log("Authenticated client created:", !!authenticatedClient);

      try {
        console.log("Making GraphQL request...");
        const result = await authenticatedClient.request(
          UPDATE_USER_PREFERENCES,
          {
            preferences,
          },
        );
        console.log("GraphQL request successful:", result);
        return result;
      } catch (error) {
        console.error("Failed to update preferences:", error);
        toast.error("Failed to update preferences");
        throw error;
      }
    },
    onSuccess: ({ data }) => {
      console.log("Preferences updated successfully:", data);
      // toast.success("Preferences updated successfully");

      // Invalidate the route to refetch user data with updated preferences
      router.invalidate();
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
        console.log("Calling mutation with preferences:", preferences);
        console.log("Mutation ref:", mutationRef.current);
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
    if (!user) return; // Don't update if user is not authenticated

    // Skip the first render to avoid calling mutation on mount
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      return;
    }

    const preferences: UpdateUserPreferencesInput = {
      theme,
      imdbThreshold,
      rottenTomatoesThreshold,
      metacriticThreshold,
    };

    debouncedUpdatePreferences(preferences);
  }, [
    theme,
    imdbThreshold,
    rottenTomatoesThreshold,
    metacriticThreshold,
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
}
