// src/state/features.ts
import { create } from "zustand"

export type FeaturesState = {
  animations: boolean
  sidebarGlow: boolean
  toasters: boolean
  compactMode: boolean
  accentGradients: boolean
  setToggle: (key: keyof Omit<FeaturesState, "setToggle">, value: boolean) => void
  loadToggles: () => void
}

export const useFeatures = create<FeaturesState>((set, get) => ({
  animations: true,
  sidebarGlow: true,
  toasters: true,
  compactMode: false,
  accentGradients: true,

  setToggle: (key, value) => {
    const updated = { ...get(), [key]: value }
    localStorage.setItem("9td_features", JSON.stringify(updated))
    set({ [key]: value } as any)
  },

  loadToggles: () => {
    try {
      const data = localStorage.getItem("9td_features")
      if (data) set(JSON.parse(data))
    } catch (e) {
      console.warn("Failed to load feature toggles", e)
    }
  },
}))
