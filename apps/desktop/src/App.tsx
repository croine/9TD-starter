// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import Toaster from "@/components/Toaster"
import CreateTaskModal from "@/components/CreateTaskModal"
import ThemeSettingsModal from "@/components/ThemeSettingsModal"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/state/theme"
import { useUI } from "@/state/ui"
import { useFeatures } from "@/state/features"
import { useLayout } from "@/state/layout"
import Tasks from "@/routes/Tasks"
import YourTasks from "@/routes/YourTasks"
import Logs from "@/routes/Logs"
import Settings from "@/routes/Settings"
import Updates from "@/routes/Updates" // ✅ added this import

export default function App() {
  const { mode } = useTheme()
  const sidebarOpen = useUI((s) => s.sidebarOpen)
  const { animations } = useFeatures()
  const layout = useLayout()

  const widthClass =
    layout.contentWidth === "compact"
      ? "max-w-4xl"
      : layout.contentWidth === "wide"
      ? "max-w-6xl"
      : "max-w-none"

  return (
    <div
      className={`min-h-screen w-full flex flex-col transition-all duration-300 ${
        mode === "dark"
          ? "bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100"
          : "bg-gradient-to-b from-brand-50 to-cozy-50 text-slate-800"
      }`}
    >
      <Header />
      <main
        className={`flex flex-1 overflow-hidden transition-all duration-300 ${
          layout.sidebarPosition === "right" ? "flex-row-reverse" : ""
        }`}
      >
        <Sidebar />
        <AnimatePresence mode="wait">
          <motion.div
            key={sidebarOpen ? "open" : "closed"}
            initial={animations ? { opacity: 0, x: 25 } : undefined}
            animate={animations ? { opacity: 1, x: 0 } : undefined}
            exit={animations ? { opacity: 0, x: -25 } : undefined}
            transition={
              animations ? { duration: 0.4, ease: "easeInOut" } : undefined
            }
            className={`flex-1 overflow-y-auto relative p-6 sm:p-8 ${widthClass}`}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/tasks" replace />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/your-tasks" element={<YourTasks />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/updates" element={<Updates />} /> {/* ✅ works now */}
              <Route path="/settings" element={<Settings />} />
            </Routes>

            <motion.footer
              initial={animations ? { opacity: 0 } : undefined}
              animate={animations ? { opacity: 0.8 } : undefined}
              whileHover={animations ? { opacity: 1, y: -2 } : undefined}
              transition={animations ? { duration: 0.5 } : undefined}
              className="absolute bottom-4 right-6 text-xs text-slate-500 select-none"
            >
              <span className="font-semibold text-brand-600">9TD</span> v0.1.0 — Cozy Build
            </motion.footer>
          </motion.div>
        </AnimatePresence>
      </main>

      <CreateTaskModal />
      <ThemeSettingsModal />
      <Toaster />
    </div>
  )
}
