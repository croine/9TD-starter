import TaskCard from "@/components/TaskCard"
import { useTasks } from "@/state/tasks"

export default function YourTasks() {
  const { tasks } = useTasks()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

      {tasks.length === 0 ? (
        <div className="text-center text-slate-500 mt-10">
          You have no tasks yet. Create one using the button in the header.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
