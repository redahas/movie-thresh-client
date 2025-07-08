import { useVantaFog } from "../hooks/useVantaFog";
import { useVantaStore } from "../stores/vantaStore";
import { useTheme } from "../hooks/useTheme";
import { useEffect } from "react";

export function GlobalVantaBackground() {
  const { currentColors } = useVantaStore();
  const { isDark } = useTheme();

  const { elementRef, isReady } = useVantaFog({
    speed: 1,
    zoom: 0.4,
    blurFactor: 0.68,
    // Explicitly set the colors from the store
    ...currentColors,
  });

  return (
    <div
      ref={elementRef}
      className={`fixed inset-0 -z-10 transition-opacity duration-500 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: "transparent",
      }}
    />
  );
}
