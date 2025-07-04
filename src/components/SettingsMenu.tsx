import { useState, useEffect, useRef } from "react";
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Palette,
  Volume2,
  VolumeX,
  Check,
} from "lucide-react";
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [smoothScrolling, setSmoothScrolling] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);

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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle wheel events on the scrollable content
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
        className="w-[400px] sm:w-[540px] flex flex-col h-full"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your movie browsing experience
          </SheetDescription>
        </SheetHeader>

        <div
          ref={scrollableRef}
          onWheel={handleWheel}
          className="flex flex-col gap-6 p-4 overflow-y-auto flex-1 min-h-0"
        >
          {/* Rating Thresholds */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Rating Thresholds</Label>
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

          <Separator />

          {/* Additional Settings */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Display</Label>
              <p className="text-sm text-muted-foreground">
                Customize how content is displayed
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="poster-size" className="text-sm">
                  Poster Size
                </Label>
                <select
                  id="poster-size"
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                  defaultValue="medium"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="grid-columns" className="text-sm">
                  Grid Columns
                </Label>
                <select
                  id="grid-columns"
                  className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                  defaultValue="4"
                >
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
