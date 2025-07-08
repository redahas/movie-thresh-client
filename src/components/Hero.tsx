import { Button } from "~/components/ui/button";
import { Link } from "@tanstack/react-router";
import { HowItWorks } from "~/components/HowItWorks";
import { SlideInCopy } from "~/components/SlideInCopy";
import { useTheme } from "~/hooks/useTheme";

export function Hero() {
  const { isDark, isInitialized } = useTheme();

  // Don't render content until theme is initialized
  // if (!isInitialized) {
  //   return (
  //     <section
  //       role="banner"
  //       aria-labelledby="hero-title"
  //       className="py-20 px-4"
  //     >
  //       <div className="max-w-4xl flex flex-col gap-1">
  //         {/* Skeleton loading state */}
  //         <div className="animate-pulse">
  //           <div className="h-16 md:h-24 bg-muted rounded mb-6"></div>
  //           <div className="h-6 md:h-8 bg-muted rounded mb-2 w-3/4"></div>
  //           <div className="h-4 bg-muted rounded w-1/2"></div>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section role="banner" aria-labelledby="hero-title" className="py-20 px-4">
      <div className="max-w-4xl flex flex-col gap-1">
        <h1
          id="hero-title"
          className={`pb-[5px] text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent from-foreground to-muted-foreground`}
          // className={`pb-[5px] text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r bg-clip-text text-transparent ${
          //   isDark
          //     ? "from-white to-muted-foreground"
          //     : "from-foreground to-muted-foreground"
          // }`}
        >
          {/* MovieThresh */}
          Know it's good
          <br />
          without knowing too much.
        </h1>
        <SlideInCopy
          animateOnScroll={false}
          type="lines"
          duration={1}
          delay={0.5}
          stagger={0.075}
        >
          <p className="text-xl md:text-2xl text-foreground mb-2 leading-relaxed">
            A movie recommendation tool that tells you if a film meets your
            quality threshold—without revealing the actual score. No spoilers,
            no bias, just a quiet green light.
          </p>
          <div className="text-sm text-foreground">
            <div className="flex justify-start items-center gap-6 opacity-60">
              <span>IMDb</span>
              <span>•</span>
              <span>Rotten Tomatoes</span>
              <span>•</span>
              <span>Metacritic</span>
            </div>
          </div>
        </SlideInCopy>
        <div className="flex flex-col sm:flex-row gap-4 justify-start mt-8">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6"
          >
            <Link to="/">How it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
