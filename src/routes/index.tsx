import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "~/components/Hero";
import { HowItWorks } from "~/components/HowItWorks";
import { useEffect } from "react";
import { resetVantaColors } from "~/utils/movieColors";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  // Reset to default colors when on home page
  useEffect(() => {
    // Add a small delay to ensure Vanta is initialized
    const timer = setTimeout(() => {
      resetVantaColors();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
