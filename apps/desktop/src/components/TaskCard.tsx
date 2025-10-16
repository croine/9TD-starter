// src/components/TaskCard.tsx
import { motion } from "framer-motion"
import { useTheme } from "@/state/theme"
import { useTasks, Task } from "@/state/tasks"
import { useToaster } from "@/state/ui"
import {
  Calendar,
  Clock,
  Flag,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Tag,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useMemo, useState } from "react"
import EditTaskModal from "@/components/EditTaskModal"

export default function TaskCard({
  task,
  className = "",
}: {
  task: Task
  className?: string
}) {
  const { getAccentClass } = useTheme()
  const { removeTask, toggleComplete, updateTask } = useTasks()
  const { pushToast } = useToaster()
  const [openMenu, setOpenMenu] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const accent = getAccentClass()

  const checklistPct = useMemo(() => {
    const list = task.checklist ?? []
    if (list.length === 0) return 0
    const done = list.filter((i) => i.done).length
    return Math.round((done / list.length) * 100)
  }, [task.checklist])

  const overdue =
    task.dueDate &&
    task.status !== "completed" &&
    new Date(task.dueDate).getTime() < Date.now()

  const priorityClass =
    task.priority === "urgent"
      ? "text-rose-600"
      : task.priority === "high"
      ? "text-red-500"
      : task.priority === "medium"
      ? "text-amber-600"
      : "text-emerald-600"

  const statusChip =
    task.status === "completed"
      ? "bg-emerald-500"
      : task.status === "in-progress"
      ? "bg-blue-500"
      : task.status === "overdue"
      ? "bg-rose-500"
      : "bg-amber-500"

  const handleDelete = () => {
    removeTask(task.id)
    pushToast({
      title: "Task Deleted",
      message: `“${task.title}” removed.`,
      type: "error",
    })
  }

  const handleToggle = () => {
    toggleComplete(task.id)
    pushToast({
      title:
        task.status === "completed" ? "Marked Pending" : "Task Completed 🎉",
      message:
        task.status === "completed"
          ? `“${task.title}” moved back to pending.`
          : `“${task.title}” is done.`,
      type: "success",
    })
  }

  const handleFavorite = () => {
    updateTask(task.id, { favorite: !task.favorite })
    pushToast({
      title: task.favorite ? "Unfavorited" : "Favorited",
      message: task.favorite
        ? `Removed “${task.title}” from favorites.`
        : `Added “${task.title}” to favorites ⭐`,
      type: "info",
    })
  }

  // Relative time function
  const getRelativeDueDate = () => {
    if (!task.dueDate) return "No due date"
    const now = new Date()
    const diff = new Date(task.dueDate).getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return `Overdue by ${Math.abs(days)} day${days !== -1 ? "s" : ""}`
    if (days === 0) return "Due today"
    if (days === 1) return "Due tomorrow"
    return `Due in ${days} days`
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ scale: 1.02 }}
        className={`p-5 rounded-xl shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative transition-all duration-200 ${
          task.favorite ? "ring-2 ring-amber-400" : ""
        } ${className}`}
        style={{
          borderTopColor: task.color || undefined,
          borderTopWidth: 3,
          boxShadow: task.color
            ? `0 0 6px ${task.color}55`
            : "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold leading-snug flex items-center gap-2">
              {task.title}
              {task.favorite && <Star size={14} className="text-amber-400" />}
            </h3>
            {task.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] text-white ${statusChip}`}
              title="Status"
            >
              {task.status}
            </span>

            <button
              onClick={handleFavorite}
              className="p-1 rounded-md hover:bg-amber-50 dark:hover:bg-slate-700"
              title={task.favorite ? "Unfavorite" : "Favorite"}
            >
              <Star
                size={16}
                className={task.favorite ? "text-amber-400" : "text-slate-400"}
              />
            </button>

            <button
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setOpenMenu((v) => !v)}
              title="More"
            >
              <MoreHorizontal size={18} />
            </button>

            {openMenu && (
              <div className="absolute right-3 top-10 z-10 min-w-[150px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
                <button
                  onClick={() => {
                    setEditOpen(true)
                    setOpenMenu(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </button>
                <button
                  onClick={handleToggle}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  {task.status === "completed" ? (
                    <>
                      <XCircle size={16} /> Mark Pending
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Mark Complete
                    </>
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <span className={`flex items-center gap-1 ${priorityClass}`}>
            <Flag size={14} />
            {task.priority}
          </span>

          <span
            className={`flex items-center gap-1 ${
              overdue ? "text-rose-600 font-medium" : ""
            }`}
            title={task.dueDate ? new Date(task.dueDate).toLocaleString() : ""}
          >
            <Calendar size={14} />
            {getRelativeDueDate()}
          </span>

          <span className="flex items-center gap-1">
            <Clock size={14} />
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>

          {task.tags?.length ? (
            <span className="flex items-center gap-1">
              <Tag size={14} />
              <span className="flex flex-wrap gap-1">
                {task.tags.slice(0, 3).map((tg) => (
                  <span
                    key={tg}
                    className="px-2 py-[2px] rounded-full bg-slate-100 dark:bg-slate-700"
                    title={tg}
                  >
                    {tg}
                  </span>
                ))}
                {task.tags.length > 3 && (
                  <span className="opacity-70">+{task.tags.length - 3}</span>
                )}
              </span>
            </span>
          ) : null}
        </div>

        {/* Expandable details */}
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 text-sm text-slate-700 dark:text-slate-300"
          >
            <p>{task.description || "No additional details."}</p>
            {task.category && (
              <p className="mt-2 text-xs text-slate-500">
                Category: {task.category}
              </p>
            )}
          </motion.div>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center text-xs text-brand-600 hover:underline"
        >
          {expanded ? (
            <>
              <ChevronUp size={12} /> Hide details
            </>
          ) : (
            <>
              <ChevronDown size={12} /> View details
            </>
          )}
        </button>

        {/* Progress bar if checklist */}
        {task.checklist && task.checklist.length > 0 && (
          <div className="mt-3">
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <motion.div
                layout
                className={`h-full bg-gradient-to-r ${accent}`}
                animate={{ width: `${checklistPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-1 text-[11px] text-slate-500">
              Checklist {checklistPct}% complete
            </div>
          </div>
        )}
      </motion.div>

      {editOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setEditOpen(false)}
          onSaved={(updates) => {
            updateTask(task.id, updates)
            setEditOpen(false)
          }}
        />
      )}
    </>
  )
}
