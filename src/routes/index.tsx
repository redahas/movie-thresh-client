import { createFileRoute } from '@tanstack/react-router'
import { Hero } from "~/components/Hero";
import { HowItWorks } from "~/components/HowItWorks";
import { useVantaFog } from '~/hooks/useVantaFog';

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const vantaRef = useVantaFog({
    speed: 2.30,
    zoom: 0.60,
    highlightColor: '#484442',
    midtoneColor: '#625b58',
    lowlightColor: '#736967',
    baseColor: '#282524',
    blurFactor: 0.78,
  });
  return (
    <div id="home-page" ref={vantaRef}>
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20">
      </div>
      <div className="container mx-auto p-2">
        <Hero />
        <HowItWorks />
      </div>
    </div>
  )
}
