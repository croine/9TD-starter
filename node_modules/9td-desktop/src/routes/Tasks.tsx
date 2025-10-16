// src/routes/Tasks.tsx
import { useTasks } from "@/state/tasks"
import TaskCard from "@/components/TaskCard"

export default function Tasks() {
  const { tasks } = useTasks()

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Tasks</h2>
      {tasks.length === 0 ? (
        <p className="text-slate-500">No tasks yet. Click “Create Task” in the header to add one.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  )
}
