// src/components/EditTaskModal.tsx
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Task, Priority, Status } from "@/state/tasks"
import { useToaster } from "@/state/ui"
import { Star, Plus, Trash2, CalendarDays } from "lucide-react"

const priorities: Priority[] = ["low", "medium", "high", "urgent"]
const statuses: Status[] = ["pending", "in-progress", "completed", "overdue"]

export default function EditTaskModal({
  task,
  onClose,
  onSaved,
}: {
  task: Task
  onClose: () => void
  onSaved: (updates: Partial<Task>) => void
}) {
  const { pushToast } = useToaster()

  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? "")
  const [dueDate, setDueDate] = useState(task.dueDate ?? "")
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [status, setStatus] = useState<Status>(task.status)
  const [tags, setTags] = useState(task.tags.join(", "))
  const [category, setCategory] = useState(task.category ?? "")
  const [estimate, setEstimate] = useState<number | undefined>(task.estimateMinutes)
  const [color, setColor] = useState(task.color ?? "")
  const [favorite, setFavorite] = useState(task.favorite ?? false)
  const [checklist, setChecklist] = useState(task.checklist ?? [])

  useEffect(() => {
    setTitle(task.title)
    setDescription(task.description ?? "")
    setDueDate(task.dueDate ?? "")
    setPriority(task.priority)
    setStatus(task.status)
    setTags(task.tags.join(", "))
    setCategory(task.category ?? "")
    setEstimate(task.estimateMinutes)
    setColor(task.color ?? "")
    setFavorite(task.favorite ?? false)
    setChecklist(task.checklist ?? [])
  }, [task])

  const getRelativeDueDate = () => {
    if (!dueDate) return ""
    const diff = new Date(dueDate).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return `Overdue by ${Math.abs(days)} day${days !== -1 ? "s" : ""}`
    if (days === 0) return "Due today"
    if (days === 1) return "Due tomorrow"
    return `Due in ${days} days`
  }

  const toggleFavorite = () => setFavorite(!favorite)

  const addSubtask = () => {
    setChecklist([...checklist, { id: crypto.randomUUID(), text: "", done: false }])
  }

  const updateSubtask = (id: string, text: string) => {
    setChecklist(checklist.map((c) => (c.id === id ? { ...c, text } : c)))
  }

  const toggleSubtask = (id: string) => {
    const updated = checklist.map((c) =>
      c.id === id ? { ...c, done: !c.done } : c
    )
    setChecklist(updated)
    const allDone = updated.length > 0 && updated.every((c) => c.done)
    if (allDone && status !== "completed") setStatus("completed")
  }

  const removeSubtask = (id: string) => {
    setChecklist(checklist.filter((c) => c.id !== id))
  }

  const save = () => {
    if (!title.trim()) {
      pushToast({
        title: "Missing Title",
        message: "Please enter a task title.",
        type: "error",
      })
      return
    }
    onSaved({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
      priority,
      status,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: category || undefined,
      estimateMinutes: estimate,
      color: color || undefined,
      favorite,
      checklist,
    })
    pushToast({
      title: "Task Updated",
      message: `“${title}” saved.`,
      type: "info",
    })
  }

  return (
    <AnimatePresence>
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
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 relative"
        >
          {/* Color Preview */}
          <div
            className="absolute top-0 left-0 w-full h-2 rounded-t-2xl"
            style={{ background: color || "#38bdf8" }}
          />

          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Edit Task
            <button
              onClick={toggleFavorite}
              className={`ml-auto transition ${
                favorite ? "text-amber-400" : "text-slate-400 hover:text-amber-400"
              }`}
              title={favorite ? "Unfavorite" : "Favorite"}
            >
              <Star size={18} />
            </button>
          </h3>

          <div className="space-y-4">
            {/* Title + Desc */}
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Date + Estimate */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <CalendarDays size={14} /> Due date
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                {dueDate && (
                  <p className="text-xs text-slate-500 mt-1">
                    {getRelativeDueDate()}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Estimate (mins)</label>
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

            {/* Priority + Status + Color */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Priority</label>
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
                <label className="text-sm font-medium">Card color</label>
                <input
                  type="color"
                  className="mt-1 h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 p-1 cursor-pointer"
                  value={color || "#38bdf8"}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            {/* Tags + Category */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tags (comma)</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>

            {/* Checklist */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Subtasks / Checklist
              </label>
              {checklist.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 mb-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={c.done}
                    onChange={() => toggleSubtask(c.id)}
                  />
                  <input
                    className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 px-2"
                    value={c.text}
                    onChange={(e) => updateSubtask(c.id, e.target.value)}
                    placeholder="Subtask..."
                  />
                  <button
                    onClick={() => removeSubtask(c.id)}
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addSubtask}
                className="text-xs flex items-center gap-1 text-brand-600 hover:underline mt-2"
              >
                <Plus size={12} /> Add subtask
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-3 py-1.5 text-xs rounded-lg bg-brand-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
