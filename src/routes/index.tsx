import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "~/components/Hero";
import { HowItWorks } from "~/components/HowItWorks";
import { useVantaFog } from "~/hooks/useVantaFog";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { elementRef, isReady } = useVantaFog({
    speed: 2.3,
    zoom: 0.6,
    highlightColor: "#484442",
    midtoneColor: "#625b58",
    lowlightColor: "#736967",
    baseColor: "#282524",
    blurFactor: 0.78,
  });

  // Fallback: if effect doesn't show after 2 seconds, force it to show
  const [forceShow, setForceShow] = useState(false);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isReady) {
        console.log("Vanta effect fallback: forcing show after timeout");
        setForceShow(true);
      }
    }, 2000);

    return () => clearTimeout(fallbackTimer);
  }, [isReady]);

  const shouldShow = isReady || forceShow;

  return (
    <div
      id="home-page"
      ref={elementRef}
      className={`page-transition transition-opacity duration-500 ${
        shouldShow ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20"></div>
      <div className="container mx-auto p-2">
        <Hero />
        <HowItWorks />
      </div>
    </div>
  );
}
