// src/components/ThemeSettingsModal.tsx
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/state/theme"
import { useUI } from "@/state/ui"
import { useFeatures } from "@/state/features"
import { useLayout } from "@/state/layout"
import { useState, useEffect } from "react"

export default function ThemeSettingsModal() {
  const { mode, toggle, accent, setAccent, font, setFont, resetTheme } = useTheme()
  const { showSettingsModal, setShowSettingsModal } = useUI()
  const {
    animations,
    sidebarGlow,
    toasters,
    compactMode,
    accentGradients,
    setToggle,
  } = useFeatures()
  const layout = useLayout()

  const [activeTab, setActiveTab] = useState<"colors" | "layout" | "fonts" | "advanced">("colors")
  const [customHex, setCustomHex] = useState("")
  const [localAccent, setLocalAccent] = useState(accent)

  const [devMode, setDevMode] = useState(false)
  const [showDebugOverlay, setShowDebugOverlay] = useState(false)
  const [showFPS, setShowFPS] = useState(false)
  const [verboseLogs, setVerboseLogs] = useState(false)

  useEffect(() => setLocalAccent(accent), [accent])

  // Base accent colors
  const baseColors = [
    "blue", "green", "orange", "purple", "rose", "violet",
    "amber", "emerald", "indigo", "teal",
  ]

  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    green: "#22c55e",
    orange: "#f97316",
    purple: "#8b5cf6",
    rose: "#f43f5e",
    violet: "#7c3aed",
    amber: "#f59e0b",
    emerald: "#10b981",
    indigo: "#6366f1",
    teal: "#14b8a6",
  }

  const fades = [
    { name: "Mint Fade", value: "linear-gradient(90deg, #a7f3d0, #6ee7b7)" },
    { name: "Sky Fade", value: "linear-gradient(90deg, #bae6fd, #93c5fd)" },
    { name: "Lavender Fade", value: "linear-gradient(90deg, #ddd6fe, #c4b5fd)" },
    { name: "Peach Fade", value: "linear-gradient(90deg, #fecaca, #fcd34d)" },
    { name: "Ocean Fade", value: "linear-gradient(90deg, #67e8f9, #38bdf8)" },
    { name: "Steel Fade", value: "linear-gradient(90deg, #cbd5e1, #94a3b8)" },
  ]

  const gradients = [
    { name: "Ocean Wave", value: "from-sky-400 to-blue-600" },
    { name: "Sunset Dream", value: "from-orange-400 to-pink-500" },
    { name: "Aurora Beam", value: "from-emerald-400 to-teal-500" },
    { name: "Royal Glow", value: "from-indigo-500 to-violet-600" },
    { name: "Rose Luxe", value: "from-rose-400 to-pink-500" },
    { name: "Midnight Mist", value: "from-slate-600 to-slate-900" },
  ]

  const fonts = ["inter", "raleway", "poppins", "rubik", "montserrat", "ubuntu", "nunito", "lato"]

  const handleHexInput = (value: string) => {
    setCustomHex(value)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) setAccent(value)
  }

  const resetAccent = () => {
    setAccent("blue")
    setCustomHex("")
  }

  // Developer features
  const toggleVerboseLogs = () => {
    const newValue = !verboseLogs
    setVerboseLogs(newValue)
    if (newValue) {
      console.log("%cVerbose logging enabled for 9TD", "color:limegreen;font-weight:bold")
    } else {
      console.log("%cVerbose logging disabled", "color:crimson;font-weight:bold")
    }
  }

  const toggleDebugOverlay = () => {
    setShowDebugOverlay(!showDebugOverlay)
    document.body.classList.toggle("debug-overlay", !showDebugOverlay)
  }

  const toggleFPSCounter = () => {
    setShowFPS(!showFPS)
    if (!showFPS) {
      const stats = document.createElement("div")
      stats.id = "fps-counter"
      stats.style.cssText =
        "position:fixed;bottom:5px;left:5px;background:#111;color:#0f0;font-size:11px;padding:3px 6px;border-radius:4px;font-family:monospace;z-index:9999;"
      document.body.appendChild(stats)
      let last = performance.now(),
        frames = 0
      const loop = () => {
        frames++
        const now = performance.now()
        if (now - last >= 1000) {
          stats.textContent = `${frames} FPS`
          frames = 0
          last = now
        }
        if (document.body.contains(stats)) requestAnimationFrame(loop)
      }
      loop()
    } else {
      const counter = document.getElementById("fps-counter")
      if (counter) counter.remove()
    }
  }

  const resetAll = () => {
    resetTheme()
    layout.resetLayout()
    console.clear()
  }

  return (
    <AnimatePresence>
      {showSettingsModal && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-cozy p-6 w-full max-w-2xl space-y-6 overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-lg font-display font-semibold text-center text-slate-800 dark:text-white">
              Theme & Layout Settings
            </h2>

            {/* TAB SWITCHER */}
            <div className="flex justify-center gap-3 mb-4">
              {["colors", "layout", "fonts", "advanced"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition ${
                    activeTab === tab
                      ? "bg-brand-500 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 🎨 COLORS TAB */}
            {activeTab === "colors" && (
              <div className="space-y-4">
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Accent Colors
                </div>
                <div className="flex flex-wrap gap-2">
                  {baseColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setAccent(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        localAccent === c
                          ? "border-slate-900 dark:border-white scale-110"
                          : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: colorMap[c] }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="#1E90FF"
                    value={customHex}
                    onChange={(e) => handleHexInput(e.target.value)}
                    className="w-28 border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  />
                  <button
                    onClick={resetAccent}
                    className="px-3 py-1 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    Reset
                  </button>
                </div>

                <hr className="border-slate-300 dark:border-slate-700" />

                <div className="grid grid-cols-3 gap-3">
                  {fades.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => setAccent(f.value)}
                      className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-medium shadow"
                      style={{ background: f.value }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {gradients.map((g) => (
                    <button
                      key={g.name}
                      onClick={() => setAccent(g.value)}
                      className={`h-10 rounded-lg bg-gradient-to-r ${g.value} text-xs text-white font-medium shadow`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 🧱 LAYOUT TAB */}
            {activeTab === "layout" && (
              <div className="space-y-4">
                <label className="flex justify-between text-sm">
                  <span>Sidebar Position</span>
                  <select
                    value={layout.sidebarPosition}
                    onChange={(e) => layout.setSidebarPosition(e.target.value as any)}
                    className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs p-1"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </label>

                <label className="flex justify-between text-sm">
                  <span>Corner Radius</span>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={layout.borderRadius}
                    onChange={(e) => layout.setBorderRadius(Number(e.target.value))}
                  />
                </label>

                <label className="flex justify-between text-sm">
                  <span>Shadow Depth</span>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={layout.shadowDepth}
                    onChange={(e) => layout.setShadowDepth(Number(e.target.value))}
                  />
                </label>

                <label className="flex justify-between text-sm">
                  <span>Content Width</span>
                  <select
                    value={layout.contentWidth}
                    onChange={(e) => layout.setContentWidth(e.target.value as any)}
                    className="border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs p-1"
                  >
                    <option value="compact">Compact</option>
                    <option value="wide">Wide</option>
                    <option value="full">Full</option>
                  </select>
                </label>

                <button
                  onClick={layout.resetLayout}
                  className="w-full text-xs mt-3 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Reset Layout
                </button>
              </div>
            )}

            {/* ✍️ FONTS TAB */}
            {activeTab === "fonts" && (
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Font Family
                </div>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value as any)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg p-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  {fonts.map((f) => (
                    <option key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ⚙️ ADVANCED TAB */}
            {activeTab === "advanced" && (
              <div className="space-y-3">
                {[
                  ["animations", "Enable Animations"],
                  ["sidebarGlow", "Sidebar Glow Effects"],
                  ["toasters", "Toaster Notifications"],
                  ["compactMode", "Compact Layout Mode"],
                  ["accentGradients", "Accent Gradients"],
                ].map(([key, label]) => {
                  const isActive = (useFeatures.getState() as any)[key]
                  return (
                    <label
                      key={key}
                      className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300"
                    >
                      <span>{label}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setToggle(key as any, !isActive)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          isActive ? "bg-brand-500" : "bg-slate-400"
                        }`}
                      >
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full bg-white shadow ${
                            isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </motion.button>
                    </label>
                  )
                })}

                <hr className="my-4 border-slate-300 dark:border-slate-700" />

                <div className="space-y-2">
                  <label className="flex justify-between items-center text-sm">
                    <span>Developer Mode</span>
                    <input type="checkbox" checked={devMode} onChange={() => setDevMode(!devMode)} />
                  </label>

                  {devMode && (
                    <div className="space-y-2 border-t border-slate-300 dark:border-slate-700 pt-3">
                      <label className="flex items-center justify-between text-sm">
                        <span>Show FPS Counter</span>
                        <input type="checkbox" checked={showFPS} onChange={toggleFPSCounter} />
                      </label>
                      <label className="flex items-center justify-between text-sm">
                        <span>Debug Overlay</span>
                        <input type="checkbox" checked={showDebugOverlay} onChange={toggleDebugOverlay} />
                      </label>
                      <label className="flex items-center justify-between text-sm">
                        <span>Verbose Logs</span>
                        <input type="checkbox" checked={verboseLogs} onChange={toggleVerboseLogs} />
                      </label>
                      <button
                        onClick={resetAll}
                        className="w-full px-3 py-1.5 rounded-md bg-red-500 text-white text-xs hover:bg-red-600"
                      >
                        Reset All Settings
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Close */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 motion-soft"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
