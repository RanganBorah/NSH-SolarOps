"use client"

import { useEffect, useState } from "react"
import { getProjectsByEmployee, updateProjectStatus } from "@/lib/projects"

export default function EmployeeProjectsPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [projects, setProjects] = useState<any[]>([])

  const loadProjects = (id: string) => {
    setProjects(getProjectsByEmployee(id))
  }

  useEffect(() => {
    const rawUser = localStorage.getItem("nsh_user")
    if (rawUser) {
      const user = JSON.parse(rawUser)
      setEmployeeId(user.employeeId || "")
      loadProjects(user.employeeId || "")
    }
  }, [])

  const handleStatusChange = (
    projectId: string,
    status: "pending" | "ongoing" | "completed"
  ) => {
    updateProjectStatus(projectId, status)
    loadProjects(employeeId)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">My Projects</h1>
        <p className="mt-2 text-slate-300">Projects assigned to you</p>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
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
              <p className="mt-1 text-sm text-slate-400">
                Description: {project.description || "-"}
              </p>
              <p className="mt-2 text-sm font-semibold text-yellow-400">
                Status: {project.status}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleStatusChange(project.id, "ongoing")}
                  className="rounded bg-blue-500 px-3 py-2 text-sm text-white"
                >
                  Start
                </button>
                <button
                  onClick={() => handleStatusChange(project.id, "completed")}
                  className="rounded bg-green-500 px-3 py-2 text-sm text-white"
                >
                  Complete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}