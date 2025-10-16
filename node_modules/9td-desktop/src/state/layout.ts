// src/state/layout.ts
import { create } from "zustand"

type SidebarPosition = "left" | "right"
type ContentWidth = "compact" | "wide" | "full"

export type LayoutState = {
  sidebarPosition: SidebarPosition
  borderRadius: number
  shadowDepth: number
  contentWidth: ContentWidth

  // Actions
  setSidebarPosition: (v: SidebarPosition) => void
  setBorderRadius: (v: number) => void
  setShadowDepth: (v: number) => void
  setContentWidth: (v: ContentWidth) => void
  resetLayout: () => void
}

// --- Persistence helpers ---
function loadLayout(): Partial<LayoutState> {
  try {
    const data = localStorage.getItem("9td_layout")
    return data ? JSON.parse(data) : {}
  } catch {
    console.warn("Failed to load layout settings")
    return {}
  }
}

function saveLayout(layout: Partial<LayoutState>) {
  try {
    localStorage.setItem("9td_layout", JSON.stringify(layout))
  } catch {
    console.warn("Failed to save layout settings")
  }
}

// --- Zustand Store ---
export const useLayout = create<LayoutState>((set, get) => ({
  sidebarPosition: loadLayout().sidebarPosition ?? "left",
  borderRadius: loadLayout().borderRadius ?? 12,
  shadowDepth: loadLayout().shadowDepth ?? 2,
  contentWidth: loadLayout().contentWidth ?? "wide",

  setSidebarPosition: (v) => {
    const updated = { ...get(), sidebarPosition: v }
    set({ sidebarPosition: v })
    saveLayout(updated)
  },

  setBorderRadius: (v) => {
    const updated = { ...get(), borderRadius: v }
    set({ borderRadius: v })
    saveLayout(updated)
  },

  setShadowDepth: (v) => {
    const updated = { ...get(), shadowDepth: v }
    set({ shadowDepth: v })
    saveLayout(updated)
  },

  setContentWidth: (v) => {
    const updated = { ...get(), contentWidth: v }
    set({ contentWidth: v })
    saveLayout(updated)
  },

  resetLayout: () => {
    const defaults: LayoutState = {
      sidebarPosition: "left",
      borderRadius: 12,
      shadowDepth: 2,
      contentWidth: "wide",
      setSidebarPosition: get().setSidebarPosition,
      setBorderRadius: get().setBorderRadius,
      setShadowDepth: get().setShadowDepth,
      setContentWidth: get().setContentWidth,
      resetLayout: get().resetLayout,
    }
    saveLayout(defaults)
    set({
      sidebarPosition: "left",
      borderRadius: 12,
      shadowDepth: 2,
      contentWidth: "wide",
    })
  },
}))
