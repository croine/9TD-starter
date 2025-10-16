import { useTasks } from "@/state/tasks"
import { motion } from "framer-motion"

export default function Dashboard() {
  const { tasks } = useTasks()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tasks Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <h2 className="text-3xl font-semibold mt-1">{tasks.length}</h2>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="text-3xl font-semibold mt-1">
            {tasks.filter((t) => t.status === "completed").length}
          </h2>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6">
          <p className="text-sm text-slate-500">Pending</p>
          <h2 className="text-3xl font-semibold mt-1">
            {tasks.filter((t) => t.status === "pending").length}
          </h2>
        </motion.div>

        <motion.div className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6">
          <p className="text-sm text-slate-500">Overdue</p>
          <h2 className="text-3xl font-semibold mt-1">
            {tasks.filter((t) => t.status === "overdue").length}
          </h2>
        </motion.div>
      </div>
    </div>
  )
}
