// src/components/CreateTaskModal.tsx
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useTasks, Priority, Status, Task } from "@/state/tasks"
import { useUI, useToaster } from "@/state/ui"
import { useNavigate } from "react-router-dom"
import { Calendar, Clock, Flag, Tag } from "lucide-react"

const priorities: Priority[] = ["low", "medium", "high", "urgent"]
const statuses: Status[] = ["pending", "in-progress", "completed", "overdue"]

export default function CreateTaskModal() {
  const { showCreateModal, setShowCreateModal } = useUI()
  const { addTask } = useTasks()
  const { pushToast } = useToaster()
  const navigate = useNavigate()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<string>("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [status, setStatus] = useState<Status>("pending")
  const [tags, setTags] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [estimate, setEstimate] = useState<number | undefined>(undefined)
  const [color, setColor] = useState<string>("")

  const close = () => setShowCreateModal(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      pushToast({
        title: "Missing Title",
        message: "Please enter a task title before saving.",
        type: "error",
      })
      return
    }

    const now = new Date().toISOString()
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      createdAt: now,
      updatedAt: now,
      dueDate: dueDate || undefined,
      completedAt: undefined,
      status,
      priority,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: category || undefined,
      favorite: false,
    }

    addTask(task)

    pushToast({
      title: "Task Created",
      message: `“${task.title}” has been added successfully.`,
      type: "success",
    })

    close()
    navigate("/your-tasks")
  }

  return (
    <AnimatePresence>
      {showCreateModal && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Create Task</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Give it a name…"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What needs doing?"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} /> Due date
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock size={16} /> Estimate (mins)
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                    value={estimate ?? ""}
                    onChange={(e) =>
                      setEstimate(
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Flag size={16} /> Priority
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    {priorities.map((p) => (
                      <option key={p} value={p}>
                        {p[0].toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Status)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Card color (optional)</label>
                  <input
                    type="color"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 p-1 cursor-pointer"
                    value={color || "#2eaaff"}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag size={16} /> Tags (comma separated)
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="ui, bug, research"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Homepage, API, Docs…"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs rounded-lg bg-brand-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
