import { useState, useEffect, useRef } from "react";
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
import { Slider } from "~/components/ui/slider";

// Simple toggle component
function Toggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <Button
      variant={checked ? "default" : "outline"}
      size="sm"
      onClick={() => onCheckedChange(!checked)}
      className="h-8 w-16"
    >
      {checked ? <Check className="h-4 w-4" /> : "Off"}
    </Button>
  );
}

// Slider component for rating thresholds
function RatingSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm text-muted-foreground">
          {value}
          {unit}
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
}

export function SettingsMenu() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [smoothScrolling, setSmoothScrolling] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Rating threshold states
  const [imdbThreshold, setImdbThreshold] = useState(6.0);
  const [rottenTomatoesThreshold, setRottenTomatoesThreshold] = useState(60);
  const [metacriticThreshold, setMetacriticThreshold] = useState(6.0);

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

            <Separator />

            {/* Smooth Scrolling Settings */}
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
                  checked={smoothScrolling}
                  onCheckedChange={setSmoothScrolling}
                />
              </div>
            </div>

            <Separator />

            {/* Animation Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable smooth transitions and effects
                  </p>
                </div>
                <Toggle
                  checked={animationsEnabled}
                  onCheckedChange={setAnimationsEnabled}
                />
              </div>
            </div>

            <Separator />

            {/* Auto-play Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Auto-play Trailers
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play movie trailers
                  </p>
                </div>
                <Toggle checked={autoPlay} onCheckedChange={setAutoPlay} />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
