import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SEARCH_MOVIES } from "../graphql/queries";

export const searchMoviesFn = createServerFn({ method: "GET" })
  .validator((d: { query: string }) => d)
  .handler(async ({ data }) => {
    const { query } = data;

    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      // Send GraphQL query to your local GraphQL server
      const response = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: SEARCH_MOVIES,
          variables: { query: query.trim() },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        return [];
      }

      return result.data?.searchMovies || [];
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  });

export const Route = createFileRoute("/search")({
  component: () => null, // This route doesn't render anything
});
