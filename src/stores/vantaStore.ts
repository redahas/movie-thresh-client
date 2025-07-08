import { create } from 'zustand';

interface ColorPalette {
  highlightColor?: string;
  midtoneColor?: string;
  lowlightColor?: string;
  baseColor?: string;
}

interface VantaStore {
  currentColors: ColorPalette;
  updateColors: (colors: ColorPalette) => void;
}

export const defaultColors = {
  highlightColor: "#e3e3e3",
  midtoneColor: "#e4e4e2",
  lowlightColor: "#e4e4e2",
  baseColor: "#babcbe",
}
// export const defaultColors = {
//   highlightColor: "#374c57",
//   midtoneColor: "#3d515c",
//   lowlightColor: "#2d4047",
//   baseColor: "#28353d",
// }
// export const defaultColors = {
//   highlightColor: "#43536d",
//   midtoneColor: "#43536d",
//   lowlightColor: "#2e3c54",
//   baseColor: "#030719",
// }
// export const defaultColors = {
//   highlightColor: "#f97a11",
//   midtoneColor: "#771d1f",
//   lowlightColor: "#4c273d",
//   baseColor: "#be3616",
// }

export const useVantaStore = create<VantaStore>((set) => ({
  currentColors: defaultColors,
  updateColors: (colors) => set({ currentColors: colors }),
}));
