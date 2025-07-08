import { useEffect, useState } from "react";
import ColorThief from "colorthief";
import { useVantaFog } from "~/hooks/useVantaFog";
import { rgbToHex } from "~/utils/colors";

export const ColourThiefVanta = ({ imageUrl }: { imageUrl: string }) => {
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      const colorThief = new ColorThief();
      const colors = colorThief.getPalette(image);

      setColors(colors.map((color) => rgbToHex(color[0], color[1], color[2])));
    };
  }, [imageUrl]);

  return colors.length > 0 ? (
    <VantaFog
      highlightColor={colors[0]}
      midtoneColor={colors[1]}
      lowlightColor={colors[2]}
      baseColor={colors[3]}
    />
  ) : null;
};

const VantaFog = ({
  highlightColor,
  midtoneColor,
  lowlightColor,
  baseColor,
}: {
  highlightColor: string;
  midtoneColor: string;
  lowlightColor: string;
  baseColor: string;
}) => {
  const { elementRef, isReady } = useVantaFog({
    speed: 2.3,
    zoom: 0.6,
    highlightColor,
    midtoneColor,
    lowlightColor,
    baseColor,
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
      ref={elementRef}
      className={`absolute inset-0 transition-opacity duration-500 ${
        shouldShow ? "opacity-100" : "opacity-0"
      }`}
    />
  );
};
