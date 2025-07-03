import { createFileRoute } from "@tanstack/react-router";
import { queryClient } from "../lib/query-client";
import { queryKeys } from "../lib/query-client";
import { graphqlClient } from "../lib/graphql-client";
import { GET_MOVIE_DETAILS } from "../graphql/queries";

export const Route = createFileRoute("/movie/$movieId")({
  loader: async ({ params }) => {
    const tmdbId = parseInt(params.movieId, 10);

    if (isNaN(tmdbId)) {
      throw new Error("Invalid movie ID");
    }

    try {
      // Use ensureQueryData for optimal caching and SSR support
      const movie = await queryClient.ensureQueryData({
        queryKey: queryKeys.movies.details(tmdbId),
        queryFn: async () => {
          const variables = { tmdbId };
          const data = await graphqlClient.request(
            GET_MOVIE_DETAILS,
            variables,
          );
          return data.movieDetails;
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
      });

      return { movie };
    } catch (error) {
      console.error("Error loading movie details:", error);
      throw new Error(
        `Failed to load movie details: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },
  component: MovieDetailPage,
});

function MovieDetailPage() {
  const { movieId } = Route.useParams();
  const tmdbId = parseInt(movieId, 10);

  // Get data from the loader (already fetched and cached)
  const { movie } = Route.useLoaderData();

  console.log("🎬 Movie details page loaded for movieId:", movieId);
  console.log("🎬 View transition name should be: movie-poster-" + movieId);

  if (isNaN(tmdbId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              Invalid Movie ID
            </h1>
            <p className="text-red-700">
              The movie ID "{movieId}" is not valid. Please check the URL and
              try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-yellow-800 mb-4">
              Movie Not Found
            </h1>
            <p className="text-yellow-700">No movie found with ID {movieId}.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6 movie-title"
          style={{ viewTransitionName: `movie-title-${movieId}` }}
        >
          {movie.title}
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Movie Poster */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {movie.poster && movie.poster !== "N/A" ? (
                  <img
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    className="w-full rounded-lg shadow-lg object-cover movie-poster"
                    style={{
                      viewTransitionName: `movie-poster-slide-up-${movieId}`,
                    }}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://via.placeholder.com/300x450/cccccc/666666?text=No+Poster";
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-[450px] bg-gray-200 rounded-lg flex items-center justify-center movie-poster"
                    style={{
                      viewTransitionName: `movie-poster-slide-up-${movieId}`,
                    }}
                  >
                    <div className="text-center text-gray-500">
                      <div className="text-4xl mb-2">🎬</div>
                      <div className="text-sm">No Poster Available</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div
              className="lg:col-span-3 space-y-6 movie-details"
              style={{ viewTransitionName: `movie-details-${movieId}` }}
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p>
                      <span className="font-medium">Year:</span> {movie.year}
                    </p>
                    <p>
                      <span className="font-medium">Released:</span>{" "}
                      {movie.released}
                    </p>
                    <p>
                      <span className="font-medium">Runtime:</span>{" "}
                      {movie.runtime}
                    </p>
                    <p>
                      <span className="font-medium">Genre:</span> {movie.genre}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Director:</span>{" "}
                      {movie.director}
                    </p>
                    <p>
                      <span className="font-medium">Writer:</span>{" "}
                      {movie.writer}
                    </p>
                    <p>
                      <span className="font-medium">Language:</span>{" "}
                      {movie.language}
                    </p>
                    <p>
                      <span className="font-medium">Rated:</span> {movie.rated}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Plot
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {movie.plot}
                </p>
              </div>

              {movie.ratings && movie.ratings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Ratings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movie.ratings.map(
                      (
                        rating: { source: string; value: string },
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 border"
                        >
                          <div className="font-semibold text-gray-800 mb-1">
                            {rating.source}
                          </div>
                          <div className="text-lg font-medium text-blue-600">
                            {rating.value}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Quick Info Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Quick Info</h3>
                <div className="text-blue-700 space-y-2 text-sm">
                  <p>
                    <strong>TMDB ID:</strong> {movieId}
                  </p>
                  <p>
                    <strong>Title:</strong> {movie.title}
                  </p>
                  <p>
                    <strong>Year:</strong> {movie.year}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
