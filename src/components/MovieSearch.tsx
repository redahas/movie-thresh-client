import { useState, useEffect, useCallback, useRef } from "react";
import { AutoComplete } from "~/components/AutoComplete";
import { useRouter } from "@tanstack/react-router";
import { Option } from "~/types/base";
import { SearchIcon } from "lucide-react";
import { useSearchMovies, usePrefetchMovieDetails } from "~/hooks/useMovies";

export function MovieSearch() {
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const prefetchMovieDetails = usePrefetchMovieDetails();

  // Use TanStack Query for movie search
  const { data: movies, isLoading, error } = useSearchMovies(debouncedQuery);

  // Convert movies to options format
  const results: Option<string>[] =
    movies?.map((movie) => ({
      value: movie.tmdbId.toString(),
      label: movie.title,
    })) || [];

  // Debounced search effect
  useEffect(() => {
    // Clear any existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If query is too short, clear results immediately
    if (query.trim().length < 2) {
      setDebouncedQuery("");
      return;
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
      // Note: Removed redundant prefetch since useSearchMovies already handles this
    }, 300);

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  const handleNavigate = (
    value: string,
    item: { value: string; label: string },
  ) => {
    console.log("🎬 Navigating to movie:", value);

    // Use view transition if supported, otherwise normal navigation
    if (document.startViewTransition) {
      console.log("🎬 Using view transition API");

      // Small delay to ensure view transition names are set
      setTimeout(() => {
        const transition = document.startViewTransition!(() => {
          router.navigate({
            to: "/movie/$movieId",
            params: { movieId: value },
          });
        });

        transition.finished
          .then(() => {
            console.log("🎬 View transition completed successfully");
          })
          .catch((error) => {
            console.log("🎬 View transition failed:", error);
            router.navigate({
              to: "/movie/$movieId",
              params: { movieId: value },
            });
          });
      }, 10);
    } else {
      console.log("🎬 View transition not supported, using normal navigation");
      router.navigate({
        to: "/movie/$movieId",
        params: { movieId: value },
      });
    }
  };

  const getHref = (value: string, item: { value: string; label: string }) => {
    return `/movie/${value}`;
  };

  return (
    <div className="w-full max-w-xl">
      <AutoComplete
        selectedValue={selectedValue}
        onSelectedValueChange={setSelectedValue}
        searchValue={query}
        onSearchValueChange={setQuery}
        items={results ?? []}
        leftIcon={<SearchIcon className="w-4 h-4" />}
        isLoading={isLoading}
        emptyMessage="No movies found."
        onNavigate={handleNavigate}
        getHref={getHref}
      />
    </div>
  );
}
