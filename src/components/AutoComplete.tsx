import { cn } from "../lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check, SearchIcon, XIcon } from "lucide-react";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { usePrefetchMovieDetails } from "~/hooks/useMovies";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "@tanstack/react-router";
import type { Option } from "~/types/base";

type Props<T extends string> = {
  selectedValue: T;
  onSelectedValueChange: (value: T) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: Option<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  placeholder?: string;
  onNavigate?: (value: T, item: Option<T>) => void;
  getHref?: (value: T, item: Option<T>) => string;
  leftIcon?: React.ReactNode;
};

export function AutoComplete<T extends string>({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
  isLoading,
  emptyMessage = "No items.",
  placeholder = "Search...",
  onNavigate,
  getHref,
  leftIcon,
}: Props<T>) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefetchMovieDetails = usePrefetchMovieDetails();

  // Debounced hover state for prefetching
  const hoverTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const labels = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>,
      ),
    [items],
  );

  const reset = () => {
    onSelectedValueChange("" as T);
    onSearchValueChange("");
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // if (
    //   !e.relatedTarget?.hasAttribute("cmdk-list") &&
    //   labels[selectedValue] !== searchValue
    // ) {
    //   reset();
    // }
  };

  const onSelectItem = (inputValue: string) => {
    const selectedItem = items.find((item) => item.value === inputValue);

    if (onNavigate && selectedItem) {
      // If navigation is provided, use it
      onNavigate(inputValue as T, selectedItem);
    } else {
      // Default behavior
      if (inputValue === selectedValue) {
        reset();
      } else {
        onSelectedValueChange(inputValue as T);
        onSearchValueChange(labels[inputValue] ?? "");
      }
    }
    setOpen(false);
    onSearchValueChange("");
  };
  const handleClear = useCallback(() => {
    inputRef.current?.focus();
    onSearchValueChange("");
  }, []);

  // Debounced hover handlers for prefetching
  const handleMouseEnter = useCallback(
    (movieId: string) => {
      console.log("🖱️ Mouse enter on movieId:", movieId);
      // Clear any existing timeout for this movie
      const existingTimeout = hoverTimeouts.current.get(movieId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        console.log("⏰ Cleared existing timeout for movieId:", movieId);
      }

      // Set a new timeout to prefetch after 100ms of hover
      const timeout = setTimeout(() => {
        console.log("⏰ Timeout fired for movieId:", movieId);
        const tmdbId = parseInt(movieId, 10);
        if (!isNaN(tmdbId)) {
          console.log("🎬 Calling prefetchMovieDetails for tmdbId:", tmdbId);
          prefetchMovieDetails(tmdbId);
        } else {
          console.log("❌ Invalid tmdbId for movieId:", movieId);
        }
        hoverTimeouts.current.delete(movieId);
      }, 400);

      hoverTimeouts.current.set(movieId, timeout);
    },
    [prefetchMovieDetails],
  );

  const handleMouseLeave = useCallback((movieId: string) => {
    console.log("🖱️ Mouse leave on movieId:", movieId);
    // Clear the timeout if user stops hovering
    const timeout = hoverTimeouts.current.get(movieId);
    if (timeout) {
      clearTimeout(timeout);
      hoverTimeouts.current.delete(movieId);
      console.log("⏰ Cancelled timeout for movieId:", movieId);
    }
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      hoverTimeouts.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      hoverTimeouts.current.clear();
    };
  }, []);

  return (
    <div className="flex items-center w-full relative">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false}>
          <PopoverAnchor asChild>
            <div className="relative w-full">
              <CommandPrimitive.Input
                asChild
                value={searchValue}
                onValueChange={onSearchValueChange}
                onKeyDown={(e) => setOpen(e.key !== "Escape")}
                onMouseDown={() => setOpen((open) => !!searchValue || !open)}
                onFocus={() => setOpen(true)}
                onBlur={onInputBlur}
              >
                <Input
                  ref={inputRef}
                  placeholder={placeholder}
                  className="h-10 pl-10 rounded-full w-full focus-visible:ring-0"
                />
              </CommandPrimitive.Input>
              {leftIcon && (
                <div className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50 select-none z-10">
                  {leftIcon}
                </div>
              )}
              {isLoading && (
                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
              {!isLoading && searchValue.length > 0 && (
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                  onClick={handleClear}
                  aria-label="Clear search"
                  tabIndex={0}
                >
                  <XIcon className="cursor-pointer opacity-50 hover:opacity-100 size-4" />
                </button>
              )}
            </div>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}
          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className="w-[--radix-popover-trigger-width] p-0"
          >
            <CommandList className="w-full">
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {items.length > 0 && !isLoading ? (
                <CommandGroup>
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={onSelectItem}
                      asChild
                    >
                      {onNavigate ? (
                        <a
                          href={
                            getHref
                              ? getHref(option.value, option)
                              : `/movie/${option.value}`
                          }
                          className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none search-result"
                          style={{
                            viewTransitionName: `movie-poster-${option.value}`,
                          }}
                          onClick={(e) => {
                            console.log(
                              "🎬 Search result clicked:",
                              option.value,
                            );
                            console.log(
                              "🎬 View transition name:",
                              `movie-poster-${option.value}`,
                            );
                            e.preventDefault();
                            onNavigate(option.value, option);
                          }}
                          onMouseEnter={() => handleMouseEnter(option.value)}
                          onMouseLeave={() => handleMouseLeave(option.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValue === option.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {option.label}
                        </a>
                      ) : (
                        <>
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValue === option.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {option.label}
                        </>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {!isLoading && searchValue.length > 0 ? (
                <CommandEmpty className="p-2 text-sm w-full">
                  {emptyMessage ?? "No items."}
                </CommandEmpty>
              ) : null}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
