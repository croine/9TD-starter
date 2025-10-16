// src/state/logs.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { nanoid } from "nanoid"

// Types
export type LogType =
  | "created"
  | "updated"
  | "deleted"
  | "completed"
  | "reopened"
  | "pinned"
  | "system"

export type LogEntry = {
  id: string
  type: LogType
  title: string
  message: string
  color: string
  createdAt: string
  pinned?: boolean
  metadata?: Record<string, any> // holds taskId or other info
}

// State
type LogState = {
  logs: LogEntry[]
  addLog: (
    type: LogType,
    title: string,
    message: string,
    color?: string,
    metadata?: Record<string, any>
  ) => void
  removeLog: (id: string) => void
  clearLogs: () => void
  togglePin: (id: string) => void
  filterLogs: (type?: LogType) => LogEntry[]
  getInsights: () => {
    total: number
    created: number
    updated: number
    deleted: number
    completed: number
    reopened: number
  }
}

// Helper to get color automatically if not provided
const colorMap: Record<LogType, string> = {
  created: "#16a34a", // green
  updated: "#3b82f6", // blue
  deleted: "#ef4444", // red
  completed: "#10b981", // emerald
  reopened: "#f59e0b", // amber
  pinned: "#6366f1", // indigo
  system: "#6b7280", // gray
}

// Store
export const useLogs = create<LogState>()(
  persist(
    (set, get) => ({
      logs: [],

      // ✅ Add new log entry
      addLog: (type, title, message, color, metadata) => {
        const entry: LogEntry = {
          id: nanoid(),
          type,
          title,
          message,
          color: color || colorMap[type] || "#60a5fa",
          createdAt: new Date().toISOString(),
          pinned: false,
          metadata,
        }

        set((state) => ({
          logs: [entry, ...state.logs].slice(0, 300), // keep latest 300 logs
        }))
      },

      // ✅ Remove a specific log
      removeLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }))
      },

      // ✅ Clear all logs
      clearLogs: () => {
        set({ logs: [] })
      },

      // ✅ Toggle pinning for a log
      togglePin: (id) => {
        set((state) => ({
          logs: state.logs.map((log) =>
            log.id === id ? { ...log, pinned: !log.pinned } : log
          ),
        }))
      },

      // ✅ Filter logs by type
      filterLogs: (type?: LogType) => {
        const all = get().logs
        if (!type) return all
        return all.filter((log) => log.type === type)
      },

      // ✅ Generate insights summary
      getInsights: () => {
        const all = get().logs
        const count = (t: LogType) =>
          all.filter((l) => l.type === t).length

        return {
          total: all.length,
          created: count("created"),
          updated: count("updated"),
          deleted: count("deleted"),
          completed: count("completed"),
          reopened: count("reopened"),
        }
      },
    }),
    { name: "9td_logs_v2" }
  )
)
