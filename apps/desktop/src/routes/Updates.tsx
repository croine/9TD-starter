import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  Wrench,
  Sparkles,
  Info,
  X,
} from "lucide-react"

const CHANGELOG = [
  {
    version: "1.0.0",
    date: "2025-10-16",
    highlights: [
      { type: "feature", text: "Added advanced Logs tab with analytics, export, and filters." },
      { type: "feature", text: "Introduced new Updates tab with version tracking." },
      { type: "improvement", text: "Improved performance for the task list and animations." },
      { type: "fix", text: "Fixed sidebar toggle memory bug." },
    ],
    notes:
      "This release marks a major milestone — the Logs tab now supports advanced analytics, export options, and pinned entries. The UI has also received smoother transitions, and your theme settings are now persistent between sessions.",
  },
  {
    version: "0.9.0",
    date: "2025-10-10",
    highlights: [
      { type: "feature", text: "Your Tasks tab added — tasks now persist locally." },
      { type: "fix", text: "Resolved visual glitches in dark mode cards." },
      { type: "improvement", text: "Toaster notifications now fade more smoothly." },
    ],
    notes:
      "This version focused on polishing the user experience and improving local state management. Expect faster task rendering and improved theme consistency.",
  },
  {
    version: "0.8.5",
    date: "2025-10-01",
    highlights: [
      { type: "feature", text: "Introduced theme customization modal." },
      { type: "improvement", text: "Smoothed sidebar animations and improved layout stability." },
    ],
    notes:
      "First iteration of the customization system, introducing adjustable layout, colors, and dark/light mode persistence.",
  },
]

export default function Updates() {
  const [seenVersion, setSeenVersion] = useState<string | null>(
    localStorage.getItem("9td_last_seen_version")
  )
  const [selected, setSelected] = useState<(typeof CHANGELOG)[number] | null>(null)

  const latestVersion = CHANGELOG[0].version

  // Load last opened modal (persistent)
  useEffect(() => {
    const lastOpened = localStorage.getItem("9td_last_opened_update")
    if (lastOpened) {
      const match = CHANGELOG.find((v) => v.version === lastOpened)
      if (match) setSelected(match)
    }
  }, [])

  // Mark latest version as seen on visit
  useEffect(() => {
    localStorage.setItem("9td_last_seen_version", latestVersion)
    setSeenVersion(latestVersion)
  }, [latestVersion])

  const openModal = (entry: (typeof CHANGELOG)[number]) => {
    setSelected(entry)
    localStorage.setItem("9td_last_opened_update", entry.version)
    localStorage.setItem("9td_last_seen_version", entry.version)
    setSeenVersion(entry.version)
  }

  const closeModal = () => {
    setSelected(null)
    localStorage.removeItem("9td_last_opened_update")
  }

  const iconMap = {
    feature: Sparkles,
    fix: Wrench,
    improvement: CheckCircle2,
  }
  const colorMap = {
    feature: "text-emerald-500",
    fix: "text-rose-500",
    improvement: "text-amber-500",
  }

  // compare versions simply
  const isNewer = (version: string, seen: string | null) => {
    if (!seen) return true
    const parse = (v: string) => v.split(".").map(Number)
    const [a1, a2, a3] = parse(version)
    const [b1, b2, b3] = parse(seen)
    if (a1 > b1) return true
    if (a1 < b1) return false
    if (a2 > b2) return true
    if (a2 < b2) return false
    return a3 > b3
  }

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-display font-semibold mb-1">
          Product Updates
        </h1>
        <p className="text-slate-500 text-sm">
          Stay up to date with the latest changes in{" "}
          <span className="font-semibold text-brand-600">9TD</span>.
        </p>
      </header>

      {CHANGELOG.map((entry) => {
        const newer = isNewer(entry.version, seenVersion)
        return (
          <motion.section
            key={entry.version}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => openModal(entry)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition cursor-pointer relative"
          >
            {newer && (
              <span className="absolute -top-2 -right-2 text-[10px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow">
                NEW
              </span>
            )}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Version {entry.version}</h2>
              <span className="text-xs text-slate-500">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>

            <ul className="space-y-2">
              {entry.highlights.map((h, i) => {
                const Icon = iconMap[h.type as keyof typeof iconMap] || Info
                return (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Icon
                      size={16}
                      className={`${colorMap[h.type as keyof typeof colorMap]} mt-[2px]`}
                    />
                    <span>{h.text}</span>
                  </li>
                )
              })}
            </ul>
          </motion.section>
        )
      })}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">
                  Version {selected.version}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Released on {new Date(selected.date).toLocaleDateString()}
              </p>

              <ul className="space-y-2 mb-4">
                {selected.highlights.map((h, i) => {
                  const Icon = iconMap[h.type as keyof typeof iconMap] || Info
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <Icon
                        size={16}
                        className={`${colorMap[h.type as keyof typeof colorMap]} mt-[2px]`}
                      />
                      <span>{h.text}</span>
                    </li>
                  )
                })}
              </ul>

              {selected.notes && (
                <div className="text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <p>{selected.notes}</p>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={closeModal}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
