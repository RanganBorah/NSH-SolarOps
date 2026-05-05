"use client"

import { useEffect, useState } from "react"
import { getEmployees } from "@/lib/employees"
import {
  addTask,
  getCompletedTasksCount,
  getPendingTasksCount,
  getTasks,
} from "@/lib/tasks"

export default function OwnerDashboard() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [employees, setEmployees] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [completedCount, setCompletedCount] = useState(0)

  const loadData = () => {
    setEmployees(getEmployees())
    setTasks(getTasks())
    setPendingCount(getPendingTasksCount())
    setCompletedCount(getCompletedTasksCount())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAssignTask = () => {
    if (!title.trim() || !employeeId) return

    const employee = employees.find((e) => e.employeeId === employeeId)

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      employeeId,
      employeeName: employee?.name || "",
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
    }

    addTask(newTask)
    setTitle("")
    setDescription("")
    setEmployeeId("")
    loadData()
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Total Employees</p>
          <p className="mt-2 text-2xl font-bold text-white">{employees.length}</p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Pending Tasks</p>
          <p className="mt-2 text-2xl font-bold text-yellow-400">{pendingCount}</p>
        </div>

        <div className="rounded-xl bg-slate-800 p-5">
          <p className="text-slate-400">Completed Tasks</p>
          <p className="mt-2 text-2xl font-bold text-green-400">{completedCount}</p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Assign Task</h2>

        <input
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.name} ({emp.employeeId})
            </option>
          ))}
        </select>

        <button
          onClick={handleAssignTask}
          className="rounded-md bg-green-500 px-5 py-3 font-semibold text-white"
        >
          Assign Task
        </button>
      </div>

      <div className="rounded-xl bg-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Recent Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-slate-400">No tasks assigned yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{task.title}</p>
              <p className="mt-1 text-sm text-slate-300">
                Employee: {task.employeeName} ({task.employeeId})
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Description: {task.description || "-"}
              </p>
              <p className="mt-1 text-sm text-slate-400">Date: {task.date}</p>
              <p
                className={`mt-2 text-sm font-semibold ${
                  task.status === "completed" ? "text-green-400" : "text-yellow-400"
                }`}
              >
                {task.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}