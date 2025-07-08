import { Check, X, Minus } from "lucide-react";
import { usePreferences } from "~/contexts/PreferencesContext";
import { Card, CardContent } from "~/components/ui/card";

interface Rating {
  source: string;
  value: string;
}

interface MovieRatingCardProps {
  title: string;
  ratings: Rating[];
}

export function MovieRatingCard({ title, ratings }: MovieRatingCardProps) {
  const { preferences } = usePreferences();

  // Helper function to get rating value as number
  const getRatingValue = (source: string): number | null => {
    const rating = ratings.find((r) => r.source === source);
    if (!rating) return null;

    const value = rating.value;
    // Handle different rating formats
    if (value.includes("%")) {
      return parseFloat(value.replace("%", ""));
    }
    if (value.includes("/")) {
      const [numerator, denominator] = value.split("/");
      return (parseFloat(numerator) / parseFloat(denominator)) * 100;
    }
    return parseFloat(value);
  };

  // Helper function to get rating icon
  const getRatingIcon = (source: string) => {
    const ratingValue = getRatingValue(source);
    const threshold = getThreshold(source);

    if (ratingValue === null) {
      return <Minus className="w-5 h-5 text-gray-400" />;
    }

    if (ratingValue >= threshold) {
      return <Check className="w-5 h-5 text-green-600" />;
    }

    return <X className="w-5 h-5 text-red-600" />;
  };

  // Helper function to get threshold for a source
  const getThreshold = (source: string): number => {
    switch (source) {
      case "imdb":
        return preferences.imdbThreshold * 10; // Convert to percentage
      case "rotten_tomatoes":
        return preferences.rottenTomatoesThreshold;
      case "metacritic":
        return preferences.metacriticThreshold * 10; // Convert to percentage
      default:
        return 0;
    }
  };

  // Helper function to get rating display text
  const getRatingText = (source: string): string => {
    const ratingValue = getRatingValue(source);
    if (ratingValue === null) return "N/A";
    return `${Math.round(ratingValue)}%`;
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          {/* Movie Title */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          </div>

          {/* Rating Indicators */}
          <div className="flex items-center gap-6">
            {/* IMDb */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                {getRatingIcon("imdb")}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                IMDb
              </div>
            </div>

            {/* Rotten Tomatoes */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                {getRatingIcon("rotten_tomatoes")}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                RT
              </div>
            </div>

            {/* Metacritic */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2">
                {getRatingIcon("metacritic")}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                MC
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
