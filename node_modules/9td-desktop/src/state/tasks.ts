// src/state/tasks.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useLogs } from "@/state/logs"

// Define types
export type Priority = "low" | "medium" | "high" | "urgent"
export type Status = "pending" | "in-progress" | "completed" | "overdue"

export type Subtask = {
  id: string
  text: string
  done: boolean
}

export type Task = {
  id: string
  title: string
  description?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  dueDate?: string
  status: Status
  priority: Priority
  tags: string[]
  category?: string
  subTags?: string[]
  color?: string
  estimateMinutes?: number
  timeSpentMinutes?: number
  checklist?: Subtask[]
  favorite?: boolean
}

// Zustand store interface
type TaskState = {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  toggleComplete: (id: string) => void
  toggleFavorite: (id: string) => void
  clearTasks: () => void
}

// Zustand task store with persistence and logs integration
export const useTasks = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      // ✅ ADD TASK + LOG CREATION
      addTask: (task) => {
        const logs = useLogs.getState()
        const now = new Date().toISOString()

        set((state) => ({
          tasks: [
            ...state.tasks,
            { ...task, createdAt: now, updatedAt: now },
          ],
        }))

        logs.addLog(
          "created",
          `Task created: ${task.title}`,
          `Description: ${task.description || "No description"} | Priority: ${
            task.priority
          } | Status: ${task.status} | Due: ${
            task.dueDate || "No due date"
          } | Created: ${new Date(now).toLocaleString()}`,
          "#16a34a",
          { taskId: task.id }
        )
      },

      // ✅ UPDATE TASK + LOG EDIT
      updateTask: (id, updates) => {
        const logs = useLogs.getState()
        const updatedAt = new Date().toISOString()

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt } : t
          ),
        }))

        const updatedTask = get().tasks.find((t) => t.id === id)
        if (updatedTask) {
          logs.addLog(
            "updated",
            `Task updated: ${updatedTask.title}`,
            `Updated fields: ${Object.keys(updates).join(", ") || "None"}`,
            "#3b82f6",
            { taskId: updatedTask.id }
          )
        }
      },

      // ✅ REMOVE TASK + LOG DELETION
      removeTask: (id) => {
        const logs = useLogs.getState()
        const removedTask = get().tasks.find((t) => t.id === id)

        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))

        if (removedTask) {
          logs.addLog(
            "deleted",
            `Task deleted: ${removedTask.title}`,
            `Deleted at ${new Date().toLocaleString()}`,
            "#ef4444",
            { taskId: id }
          )
        }
      },

      // ✅ TOGGLE COMPLETE + LOG COMPLETE / REOPEN
      toggleComplete: (id) => {
        const logs = useLogs.getState()
        const now = new Date().toISOString()

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status:
                    t.status === "completed" ? "pending" : "completed",
                  completedAt:
                    t.status === "completed" ? undefined : now,
                  updatedAt: now,
                }
              : t
          ),
        }))

        const toggled = get().tasks.find((t) => t.id === id)
        if (toggled) {
          const type =
            toggled.status === "completed" ? "completed" : "reopened"
          logs.addLog(
            type,
            `Task ${type}: ${toggled.title}`,
            `Status changed to "${toggled.status}" on ${new Date().toLocaleString()}`,
            type === "completed" ? "#10b981" : "#f59e0b",
            { taskId: toggled.id }
          )
        }
      },

      // ✅ FAVORITE TOGGLE + LOG FAVORITE CHANGE
      toggleFavorite: (id) => {
        const logs = useLogs.getState()

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, favorite: !t.favorite } : t
          ),
        }))

        const fav = get().tasks.find((t) => t.id === id)
        if (fav) {
          logs.addLog(
            "updated",
            `Task ${fav.favorite ? "favorited" : "unfavorited"}: ${fav.title}`,
            `Favorite: ${fav.favorite ? "Yes" : "No"}`,
            "#eab308",
            { taskId: fav.id }
          )
        }
      },

      // ✅ CLEAR TASKS + LOG PURGE
      clearTasks: () => {
        const logs = useLogs.getState()
        logs.addLog(
          "deleted",
          "All tasks cleared",
          "All tasks were removed from the system",
          "#dc2626"
        )
        set({ tasks: [] })
      },
    }),
    { name: "9td_tasks_v3" }
  )
)
