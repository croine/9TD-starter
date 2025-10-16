// src/routes/Logs.tsx
import { useLogs, LogEntry } from "@/state/logs"
import { motion } from "framer-motion"
import {
  Trash2,
  Clock,
  CheckCircle2,
  Edit2,
  XCircle,
  PlusCircle,
  Pin,
  PinOff,
  Download,
  ListTree,
  List as ListIcon,
  Filter,
  Info,
  Search as SearchIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

// --- Local type guard for safety ---
type LogType = "created" | "updated" | "deleted" | "completed" | "reopened"

// --- Utilities ---
const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

function daysDiff(aISO: string, bISO = new Date().toISOString()) {
  const a = new Date(aISO)
  const b = new Date(bISO)
  return Math.floor((b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)) / 86400000)
}
function groupLabelFor(iso: string) {
  const d = daysDiff(iso)
  if (d === 0) return "Today"
  if (d === 1) return "Yesterday"
  if (d <= 7) return "Last 7 Days"
  return "Older"
}

const typeColor = (t: LogType): string => {
  switch (t) {
    case "created":
      return "#3b82f6"
    case "updated":
      return "#f59e0b"
    case "completed":
      return "#10b981"
    case "deleted":
      return "#ef4444"
    default:
      return "#94a3b8"
  }
}

// ✅ Fix Lucide icon typing
type IconType = React.ComponentType<{
  size?: number | string
  color?: string
  style?: React.CSSProperties
}>

const typeIcon: Record<LogType, IconType> = {
  created: PlusCircle,
  updated: Edit2,
  deleted: Trash2,
  completed: CheckCircle2,
  reopened: XCircle,
}

// --- Sparkline mini-chart ---
function Sparkline({ series }: { series: number[] }) {
  const max = Math.max(1, ...series)
  const width = 120,
    height = 28,
    step = width / (series.length - 1)
  const points = series
    .map((v, i) => `${i * step},${height - (v / max) * (height - 2) - 1}`)
    .join(" ")
  return (
    <svg width={width} height={height} className="opacity-75">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function Logs() {
  const { logs, clearLogs, togglePin, removeLog } = useLogs()
  const [q, setQ] = useState("")
  const [view, setView] = useState<"list" | "timeline">("list")
  const [detail, setDetail] = useState<LogEntry | null>(null)
  const [activeTypes, setActiveTypes] = useState<Record<LogType, boolean>>({
    created: true,
    updated: true,
    deleted: true,
    completed: true,
    reopened: true,
  })

  // --- Filtering ---
  const filtered = useMemo(() => {
    const qL = q.trim().toLowerCase()
    return logs.filter((l) => {
      const matchType = activeTypes[l.type as LogType]
      const matchText =
        !qL ||
        l.title.toLowerCase().includes(qL) ||
        l.message.toLowerCase().includes(qL)
      return matchType && matchText
    })
  }, [logs, q, activeTypes])

  // --- Sorting + Grouping ---
  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }),
    [filtered]
  )

  const grouped = useMemo(() => {
    const map = new Map<string, LogEntry[]>()
    for (const l of sorted) {
      const label = groupLabelFor(l.createdAt)
      if (!map.has(label)) map.set(label, [])
      map.get(label)!.push(l)
    }
    return map
  }, [sorted])

  // --- Analytics ---
  const counts = useMemo(() => {
    const by = (t: LogType) => logs.filter((l) => l.type === t).length
    return {
      created: by("created"),
      updated: by("updated"),
      completed: by("completed"),
      deleted: by("deleted"),
      today: logs.filter((l) => daysDiff(l.createdAt) === 0).length,
      thisWeek: logs.filter((l) => daysDiff(l.createdAt) <= 7).length,
    }
  }, [logs])

  const completionRate = counts.created
    ? Math.round((counts.completed / counts.created) * 100)
    : 0

  const streak = useMemo(() => {
    const daysWith = new Set(logs.map((l) => new Date(l.createdAt).toDateString()))
    let s = 0
    const today = new Date()
    for (let i = 0; ; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      if (daysWith.has(d.toDateString())) s++
      else break
    }
    return s
  }, [logs])

  const series7 = useMemo(() => {
    const arr: number[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const count = logs.filter((l) => {
        const ld = new Date(l.createdAt)
        return (
          ld.getFullYear() === d.getFullYear() &&
          ld.getMonth() === d.getMonth() &&
          ld.getDate() === d.getDate()
        )
      }).length
      arr.push(count)
    }
    return arr
  }, [logs])

  // --- Export ---
  const download = (filename: string, data: BlobPart, mime: string) => {
    const blob = new Blob([data], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportJSON = () =>
    download("9td_logs.json", JSON.stringify(logs, null, 2), "application/json")

  const exportCSV = () => {
    const headers = ["id", "type", "title", "message", "color", "createdAt", "pinned"]
    const esc = (s: any) => `"${String(s ?? "").replace(/"/g, '""')}"`
    const rows = logs.map((l) =>
      [l.id, l.type, l.title, l.message, l.color || "", l.createdAt, !!l.pinned]
        .map(esc)
        .join(",")
    )
    download("9td_logs.csv", [headers.join(","), ...rows].join("\n"), "text/csv")
  }

  const TypeChip = ({ t }: { t: LogType }) => (
    <button
      onClick={() => setActiveTypes((s) => ({ ...s, [t]: !s[t] }))}
      className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
        activeTypes[t]
          ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
          : "bg-transparent text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700"
      }`}
    >
      {t}
    </button>
  )

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
          Activity Logs
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs flex items-center gap-2"
          >
            <Download size={14} /> JSON
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs flex items-center gap-2"
          >
            <Download size={14} /> CSV
          </button>
          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs hover:bg-rose-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Simple analytics row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="rounded-xl p-3 bg-emerald-100 dark:bg-emerald-900/30 text-center">
          <div className="text-xl font-semibold">{counts.completed}</div>
          <div className="text-[11px] uppercase tracking-wide">Completed</div>
        </div>
        <div className="rounded-xl p-3 bg-blue-100 dark:bg-blue-900/30 text-center">
          <div className="text-xl font-semibold">{counts.created}</div>
          <div className="text-[11px] uppercase tracking-wide">Created</div>
        </div>
        <div className="rounded-xl p-3 bg-amber-100 dark:bg-amber-900/30 text-center">
          <div className="text-xl font-semibold">{counts.updated}</div>
          <div className="text-[11px] uppercase tracking-wide">Updated</div>
        </div>
        <div className="rounded-xl p-3 bg-rose-100 dark:bg-rose-900/30 text-center">
          <div className="text-xl font-semibold">{counts.deleted}</div>
          <div className="text-[11px] uppercase tracking-wide">Deleted</div>
        </div>
        <div className="rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-xs text-slate-500">7-day activity</div>
          <Sparkline series={series7} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Filter size={16} className="opacity-60" />
        {(["created", "updated", "completed", "deleted", "reopened"] as LogType[]).map((t) => (
          <TypeChip key={t} t={t} />
        ))}
        <div className="relative ml-auto">
          <SearchIcon className="absolute left-2 top-2.5 w-4 h-4 text-slate-400" />
          <input
            className="pl-7 pr-2 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
            placeholder="Search logs…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {/* Log list */}
      {sorted.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">No matching activity.</p>
      ) : (
        [...grouped.entries()].map(([label, items]) => (
          <div key={label} className="mb-4">
            <h3 className="text-xs uppercase tracking-wide text-slate-500 mb-2">{label}</h3>
            <div className="space-y-2">
              {items.map((log) => {
                const Icon = typeIcon[log.type as LogType]
                return (
                  <motion.div
                    key={log.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm hover:shadow-md transition"
                    style={{ borderLeft: `4px solid ${log.color || typeColor(log.type as LogType)}` }}
                  >
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${log.color || typeColor(log.type as LogType)}20` }}>
                      <Icon size={18} color={log.color || typeColor(log.type as LogType)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{log.message}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
