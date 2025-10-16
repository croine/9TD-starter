// src/components/Toaster.tsx
import { useToaster } from "@/state/ui"
import { AnimatePresence, motion } from "framer-motion"

export default function Toaster() {
  const toasts = useToaster((s) => s.toasts || [])

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-[9999]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`rounded-xl shadow-lg p-4 text-sm text-white flex items-start gap-3 w-72
              ${
                t.type === "success"
                  ? "bg-emerald-500"
                  : t.type === "error"
                  ? "bg-rose-500"
                  : "bg-blue-500"
              }`}
          >
            <div className="flex-1">
              <strong className="block font-semibold">{t.title}</strong>
              <p className="opacity-90">{t.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
