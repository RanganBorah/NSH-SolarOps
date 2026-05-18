"use client"

import { useEffect, useMemo, useState } from "react"
import { getTasks } from "@/lib/tasks"
import { Task } from "@/types/task"

export default function OwnerWorkPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(getTasks())
  }, [])

  const pendingTasks = useMemo(
    () => tasks.filter((task) => task.status === "pending"),
    [tasks]
  )

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "completed"),
    [tasks]
  )

  const columns = [
    { title: "Pending", tasks: pendingTasks, color: "text-yellow-400" },
    { title: "Completed", tasks: completedTasks, color: "text-green-400" },
  ]

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Work Board</h1>
        <p className="mt-2 text-slate-400">
          Track assigned employee tasks from the owner dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Total Tasks</p>
          <p className="mt-2 text-2xl font-bold text-white">{tasks.length}</p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Pending</p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">
            {pendingTasks.length}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Completed</p>
          <p className="mt-2 text-2xl font-bold text-green-400">
            {completedTasks.length}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {columns.map((column) => (
          <section key={column.title} className="rounded-xl bg-slate-800 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {column.title}
              </h2>
              <span className={`text-sm font-semibold ${column.color}`}>
                {column.tasks.length}
              </span>
            </div>

            {column.tasks.length === 0 ? (
              <p className="text-slate-400">
                No {column.title.toLowerCase()} tasks.
              </p>
            ) : (
              <div className="space-y-4">
                {column.tasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-lg border border-slate-700 p-4"
                  >
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-300">
                      {task.description || "-"}
                    </p>
                    <p className="mt-3 text-sm text-slate-400">
                      Employee: {task.employeeName || "-"} ({task.employeeId})
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Date: {task.date}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}