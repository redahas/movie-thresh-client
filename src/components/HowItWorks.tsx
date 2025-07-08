import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SlidersVerticalIcon, DatabaseIcon, ThumbsUpIcon } from "lucide-react";
import { useTheme } from "~/hooks/useTheme";

const steps = [
  {
    Icon: SlidersVerticalIcon,
    id: "set-threshold",
    title: "Set your minimum rating threshold (e.g., 7.5/10)",
  },
  {
    Icon: DatabaseIcon,
    id: "check-ratings",
    title: "We check IMDb, Rotten Tomatoes, and Metacritic",
  },
  {
    Icon: ThumbsUpIcon,
    id: "get-recommendation",
    title: "If a movie meets your threshold, we'll let you know!",
  },
];

export function HowItWorks() {
  const { isInitialized } = useTheme();

  // Don't render content until theme is initialized
  if (!isInitialized) {
    return (
      <Card className="bg-card border rounded-lg p-6 mb-8 max-w-3xl mx-auto">
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-1/3"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-muted rounded-full mb-3"></div>
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="bg-card border rounded-lg p-6 mb-8 max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>How it works:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-primary font-bold">
                  <step.Icon className="w-6 h-6" />
                </span>
              </div>
              <p className="text-muted-foreground">{step.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
