import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";
import { HowItWorks } from "~/components/HowItWorks";

export function Hero() {
  return (
    <section role="banner" aria-labelledby="hero-title" className="py-20 px-4">
      <div className="max-w-4xl flex flex-col gap-1">
        <h1 id="hero-title" className="pb-[5px] text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          {/* MovieThresh */}
          Know it's good—without knowing too much.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-2 leading-relaxed">
          A movie recommendation tool that tells you if a film meets your quality threshold—without revealing the actual score. No spoilers, no bias, just a quiet green light.
        </p>
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-start items-center gap-6 opacity-60">
            <span>IMDb</span>
            <span>•</span>
            <span>Rotten Tomatoes</span>
            <span>•</span>
            <span>Metacritic</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-start mt-8">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link to="/">How it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
} 