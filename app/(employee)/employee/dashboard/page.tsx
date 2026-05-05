"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  addAttendance,
  clearAttendance,
  getTodayAttendanceByEmployee,
} from "@/lib/attendance"
import { getTasksByEmployee, updateTaskStatus } from "@/lib/tasks"
import { getProjectsByEmployee, updateProjectStatus } from "@/lib/projects"
import { getSalesByEmployee } from "@/lib/sales"

export default function EmployeeDashboard() {
  const [employeeName, setEmployeeName] = useState("Employee")
  const [employeeId, setEmployeeId] = useState("")
  const [marked, setMarked] = useState(false)
  const [photoName, setPhotoName] = useState("")
  const [tasks, setTasks] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])

  const loadTasks = (empId: string) => {
    setTasks(getTasksByEmployee(empId))
  }

  const loadProjects = (empId: string) => {
    setProjects(getProjectsByEmployee(empId))
  }

  const loadSales = (empId: string) => {
    setSales(getSalesByEmployee(empId))
  }

  useEffect(() => {
    const rawUser = localStorage.getItem("nsh_user")

    if (rawUser) {
      const user = JSON.parse(rawUser)
      setEmployeeName(user.name || "Employee")
      setEmployeeId(user.employeeId || "")

      const today = new Date().toISOString().split("T")[0]
      const alreadyMarked = getTodayAttendanceByEmployee(user.employeeId, today)

      if (alreadyMarked) {
        setMarked(true)
        setPhotoName(alreadyMarked.photoUrl || "")
      }

      loadTasks(user.employeeId)
      loadProjects(user.employeeId)
      loadSales(user.employeeId)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhotoName(file.name)
  }

  const handleMarkAttendance = () => {
    const today = new Date().toISOString().split("T")[0]

    const newRecord = {
      id: Date.now().toString(),
      employeeId,
      employeeName,
      date: today,
      status: "Present" as const,
      photoUrl: photoName,
    }

    addAttendance(newRecord)
    setMarked(true)
  }

  const handleResetAttendance = () => {
    clearAttendance()
    setMarked(false)
    setPhotoName("")
  }

  const handleCompleteTask = (taskId: string) => {
    updateTaskStatus(taskId, "completed")
    loadTasks(employeeId)
  }

  const handleProjectStatus = (
    projectId: string,
    status: "pending" | "ongoing" | "completed"
  ) => {
    updateProjectStatus(projectId, status)
    loadProjects(employeeId)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Employee Dashboard</h1>
        <p className="mt-2 text-slate-300">Welcome, {employeeName}</p>
        <p className="mt-1 text-slate-400">Employee ID: {employeeId}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Link href="/employee/projects" className="rounded-xl bg-slate-800 p-5 text-white">
          My Projects
        </Link>

        <Link href="/employee/inventory" className="rounded-xl bg-slate-800 p-5 text-white">
          Inventory
        </Link>

        <Link href="/employee/customers" className="rounded-xl bg-slate-800 p-5 text-white">
          Customers
        </Link>

        <Link href="/employee/quotations" className="rounded-xl bg-slate-800 p-5 text-white">
          Quotations
        </Link>

        <Link href="/employee/invoices" className="rounded-xl bg-slate-800 p-5 text-white">
          Tax Invoice
        </Link>

        <Link href="/employee/sales" className="rounded-xl bg-slate-800 p-5 text-white">
          Sales
        </Link>

        <div className="rounded-xl bg-slate-800 p-5 text-white">
          Tasks: {tasks.length}
        </div>
      </div>

      <div className="rounded-xl bg-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Attendance</h2>

        {marked ? (
          <div className="space-y-3">
            <p className="font-semibold text-green-400">Attendance Marked</p>
            <p className="text-slate-300">Photo: {photoName || "No file uploaded"}</p>
            <button
              onClick={handleResetAttendance}
              className="rounded-md bg-red-500 px-4 py-2 text-white"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block text-slate-300"
            />

            <button
              onClick={handleMarkAttendance}
              className="rounded-md bg-green-500 px-4 py-2 text-white"
            >
              Mark Attendance
            </button>
          </div>
        )}
      </div>

      <div className="rounded-xl bg-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">My Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-slate-400">No tasks assigned.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{task.title}</p>
              <p className="mt-1 text-sm text-slate-300">
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

              {task.status === "pending" && (
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="mt-3 rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                  Mark Complete
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl bg-slate-800 p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">My Projects</h2>

        {projects.length === 0 ? (
          <p className="text-slate-400">No projects assigned.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{project.title}</p>
              <p className="mt-1 text-sm text-slate-300">
                Customer: {project.customerName}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Type: {project.projectType}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Address: {project.address || "-"}
              </p>
              <p className="mt-2 text-sm font-semibold text-yellow-400">
                {project.status}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleProjectStatus(project.id, "ongoing")}
                  className="rounded bg-blue-500 px-3 py-2 text-sm text-white"
                >
                  Start
                </button>
                <button
                  onClick={() => handleProjectStatus(project.id, "completed")}
                  className="rounded bg-green-500 px-3 py-2 text-sm text-white"
                >
                  Complete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">My Sales</h2>
        <p className="mt-2 text-slate-300">Total Sales Records: {sales.length}</p>
      </div>
    </div>
  )
}