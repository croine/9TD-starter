import { useUI } from "@/state/ui"
import { useTheme } from "@/state/theme"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { Plus, Settings2 } from "lucide-react"

function RotatingBox() {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame(() => {
    mesh.current.rotation.x += 0.003
    mesh.current.rotation.y += 0.002
  })
  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.2, 0.45, 0.45]} />
      <meshStandardMaterial color="#2eaaff" metalness={0.3} roughness={0.4} />
    </mesh>
  )
}

function Logo3D() {
  return (
    <div className="w-[70px] h-[32px]">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <RotatingBox />
      </Canvas>
    </div>
  )
}

export default function Header() {
  const { searchQuery, setSearchQuery, setShowCreateModal, setShowSettingsModal } = useUI()
  const { mode, toggle, getAccentClass, getAccentStyle } = useTheme()

  const accentClass = getAccentClass() // Tailwind gradient class or null
  const accentStyle = getAccentStyle() // inline style for hex / CSS gradient or null

  const buttonBase =
    "relative flex items-center justify-center w-9 h-9 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300 text-white"

  const gradientClass = accentClass ? `bg-gradient-to-br ${accentClass}` : "bg-slate-700"

  return (
    <header className="h-[var(--header-height)] shadow-cozy sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg flex items-center px-4 gap-3 motion-soft">
      {/* Left: Logo + Title */}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
      >
        <Logo3D />
        <motion.h1
          className="text-2xl font-display font-bold tracking-tight text-brand-600 select-none"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          9TD
        </motion.h1>
      </motion.div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-full max-w-md h-9 px-4 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur placeholder:text-slate-400 text-sm"
          placeholder="Search tasks, tags, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 8 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className={`${buttonBase} ${gradientClass}`}
          style={accentStyle ?? undefined}
          title="Toggle Light/Dark Mode"
        >
          <motion.div
            animate={{ rotate: mode === "light" ? 0 : 180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="text-base"
          >
            {mode === "light" ? "☀️" : "🌙"}
          </motion.div>
        </motion.button>

        {/* Theme Settings */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: -8 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettingsModal(true)}
          className={`${buttonBase} ${gradientClass}`}
          style={accentStyle ?? undefined}
          title="Open Theme Settings"
        >
          <Settings2 className="w-4 h-4" />
        </motion.button>

        {/* Create Task */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreateModal(true)}
          className={`${buttonBase} px-3 rounded-lg ${gradientClass}`}
          style={accentStyle ?? undefined}
          title="Create New Task"
        >
          <span className="sr-only">Create</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/></svg>
        </motion.button>
      </div>
    </header>
  )
}
