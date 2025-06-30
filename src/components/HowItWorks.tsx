import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SlidersVerticalIcon, DatabaseIcon, ThumbsUpIcon } from "lucide-react";

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
