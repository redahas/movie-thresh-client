import { SearchIcon, CheckIcon, XIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { searchMoviesFn } from "~/routes/search";
import { MovieSearchResult } from "~/schema/__generated__/types.generated";

interface SearchFormProps extends React.ComponentProps<"form"> {
  placeholder?: string;
}

export function SearchForm({ placeholder, ...props }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  // Memoize the search function to prevent unnecessary re-renders
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await searchMoviesFn({
          data: { query: searchQuery.trim() },
        });
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [], // No dependencies needed since searchMoviesFn is stable
  );

  // Debounced search effect
  useEffect(() => {
    // Clear any existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If query is too short, clear results immediately
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      setIsOpen(false);
      return;
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, performSearch]);

  // Handle keyboard navigation from input to results
  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isOpen && results.length > 0) {
        if (e.key === "ArrowDown" || e.key === "Tab") {
          e.preventDefault();
          // Try to focus the first result in the Command component
          const firstResult = commandRef.current?.querySelector(
            "[cmdk-item]",
          ) as HTMLElement;
          console.log("firstResult found:", firstResult);
          console.log("firstResult tabindex:", firstResult?.tabIndex);
          console.log("firstResult focusable:", firstResult?.tabIndex >= 0);
          if (firstResult) {
            // Try multiple focus methods
            firstResult.focus();
            console.log("Focus called on:", firstResult);
          }
        }
      }
    },
    [isOpen, results.length],
  );

  // Handle result selection
  const handleResultSelect = useCallback((movie: MovieSearchResult) => {
    // setQuery(movie.title);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative flex-1 max-w-xl" role="search">
      <Input
        ref={inputRef}
        id="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length > 0 && setIsOpen(true)}
        onBlur={(e) => {
          // Don't close if focus is moving to a command item
          const relatedTarget = e.relatedTarget as HTMLElement;
          if (relatedTarget?.closest("[cmdk-item]")) {
            return;
          }
          setTimeout(() => setIsOpen(false), 200);
        }}
        onKeyDown={handleInputKeyDown}
        placeholder={placeholder ?? "Type to search..."}
        className="h-10 pl-7 rounded-full w-full"
        aria-label="Search for movies"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="search-results"
      />
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      {isSearching && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        </div>
      )}
      {!isSearching && query.length > 0 && (
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <XIcon className="cursor-pointer opacity-50 hover:opacity-100 size-4" />
        </button>
      )}
      {/* {isOpen && ( */}
      <div
        ref={commandRef}
        className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50"
        role="listbox"
        id="search-results"
        aria-label="Search results"
      >
        <Command
          onValueChange={(value) => {
            const selectedMovie = results.find(
              (movie) => movie.title === value,
            );
            if (selectedMovie) {
              handleResultSelect(selectedMovie);
            }
          }}
        >
          <CommandList>
            {isSearching ? (
              <CommandEmpty>Searching...</CommandEmpty>
            ) : results.length === 0 && query.trim().length >= 2 ? (
              <CommandEmpty>No movies found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((movie) => (
                  <CommandItem key={movie.tmdbId} value={movie.title}>
                    {movie.title}
                    <CheckIcon
                      className={cn(
                        "ml-auto",
                        movie.title ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>
      {/* )} */}
    </div>
  );
}
