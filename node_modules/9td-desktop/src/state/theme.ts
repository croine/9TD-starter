import { create } from "zustand"

export type Accent =
  | "blue" | "green" | "orange" | "purple"
  | "emerald" | "teal" | "cyan" | "sky"
  | "indigo" | "violet" | "rose" | "red"
  | "amber" | "lime"
  | string // allow custom hex or CSS gradient strings

type ThemeState = {
  mode: "light" | "dark"
  accent: Accent
  font: "inter" | "raleway" | "poppins" | "rubik" | "montserrat"
  toggle: () => void
  setAccent: (accent: Accent) => void
  setFont: (font: ThemeState["font"]) => void
  resetTheme: () => void
  /** Tailwind class for built-in colors or Tailwind gradient (from-.. to-..) */
  getAccentClass: () => string | null
  /** Inline style for hex or CSS gradients (e.g., linear-gradient...), else null */
  getAccentStyle: () => React.CSSProperties | null
}

function loadTheme(): Partial<ThemeState> {
  try {
    const data = localStorage.getItem("9td_theme")
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveTheme(theme: Partial<ThemeState>) {
  try {
    localStorage.setItem("9td_theme", JSON.stringify(theme))
  } catch {
    console.warn("Theme save failed")
  }
}

export const useTheme = create<ThemeState>((set, get) => ({
  mode: loadTheme().mode || "light",
  accent: loadTheme().accent || "blue",
  font: loadTheme().font || "inter",

  toggle: () => {
    const newMode: "light" | "dark" = get().mode === "light" ? "dark" : "light"
    const updated = { ...get(), mode: newMode }
    saveTheme(updated)
    set({ mode: newMode })
  },

  setAccent: (accent) => {
    const updated = { ...get(), accent }
    saveTheme(updated)
    set({ accent })
  },

  setFont: (font) => {
    const updated = { ...get(), font }
    saveTheme(updated)
    set({ font })
  },

  resetTheme: () => {
    const defaults: Partial<ThemeState> = { mode: "light", accent: "blue", font: "inter" }
    saveTheme(defaults)
    set({ mode: "light", accent: "blue", font: "inter" })
  },

  getAccentClass: () => {
    const accent = get().accent
    // Tailwind gradient picked in settings (e.g., "from-sky-400 to-blue-600")
    if (typeof accent === "string" && accent.startsWith("from-")) return accent

    // Map of named colors → Tailwind gradient + text
    const map: Record<string, string> = {
      blue: "from-blue-500 to-blue-600",
      green: "from-emerald-500 to-emerald-600",
      orange: "from-orange-500 to-orange-600",
      purple: "from-violet-500 to-violet-600",
      emerald: "from-emerald-500 to-emerald-600",
      teal: "from-teal-500 to-teal-600",
      cyan: "from-cyan-500 to-cyan-600",
      sky: "from-sky-500 to-sky-600",
      indigo: "from-indigo-500 to-indigo-600",
      violet: "from-violet-500 to-violet-600",
      rose: "from-rose-500 to-rose-600",
      red: "from-red-500 to-red-600",
      amber: "from-amber-500 to-amber-600",
      lime: "from-lime-500 to-lime-600",
    }

    if (map[accent]) return map[accent]
    return null
  },

  getAccentStyle: () => {
    const accent = get().accent
    if (typeof accent !== "string") return null

    // Custom HEX (e.g. "#1E90FF")
    if (/^#[0-9A-Fa-f]{6}$/.test(accent)) {
      return { background: accent }
    }

    // CSS gradient (your "fades" use linear-gradient(...))
    if (accent.startsWith("linear-gradient(")) {
      return { background: accent }
    }

    // Tailwind gradients handled by getAccentClass
    if (accent.startsWith("from-")) return null

    return null
  },
}))
