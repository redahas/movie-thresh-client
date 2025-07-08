import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "~/components/Hero";
import { HowItWorks } from "~/components/HowItWorks";
import { useEffect } from "react";
import { resetVantaColors } from "~/utils/movieColors";
import { useTheme } from "~/hooks/useTheme";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isInitialized } = useTheme();

  // Reset to default colors when on home page
  useEffect(() => {
    // Add a small delay to ensure Vanta is initialized
    const timer = setTimeout(() => {
      resetVantaColors();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Don't render content until theme is initialized
  if (!isInitialized) {
    return (
      <div
        id="home-page"
        className="page-transition animate-in fade-in duration-500"
      >
        <div className="container mx-auto p-2">
          {/* Skeleton loading state for the entire page */}
          <div className="animate-pulse">
            <div className="py-20 px-4">
              <div className="max-w-4xl flex flex-col gap-1">
                <div className="h-16 md:h-24 bg-muted rounded mb-6"></div>
                <div className="h-6 md:h-8 bg-muted rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <div className="h-6 bg-muted rounded w-1/3 mb-6"></div>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-muted rounded-full mb-3"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="home-page"
      className="page-transition animate-in fade-in duration-500"
    >
      <div className="container mx-auto p-2">
        <Hero />
        <HowItWorks />
      </div>
    </div>
  );
}
