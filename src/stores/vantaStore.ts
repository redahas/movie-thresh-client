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
  highlightColor: "#f97a11",
  midtoneColor: "#771d1f",
  lowlightColor: "#4c273d",
  baseColor: "#be3616",
}

export const useVantaStore = create<VantaStore>((set) => ({
  currentColors: defaultColors,
  updateColors: (colors) => set({ currentColors: colors }),
}));
