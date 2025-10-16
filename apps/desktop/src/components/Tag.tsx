// src/components/Tag.tsx
import { motion } from "framer-motion"

const colors: Record<string, string> = {
  bug: "bg-red-100 text-red-700",
  feature: "bg-green-100 text-green-700",
  idea: "bg-amber-100 text-amber-700",
  urgent: "bg-pink-100 text-pink-700",
  default: "bg-slate-100 text-slate-600",
}

export default function Tag({ label }: { label: string }) {
  const style = colors[label.toLowerCase()] || colors.default
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`px-2 py-[2px] rounded-full text-xs font-medium ${style}`}
    >
      {label}
    </motion.span>
  )
}
