"use client"

import { useEffect, useState } from "react"
import { getEmployees } from "@/lib/employees"
import { getCustomers } from "@/lib/customers"
import { addProject, getProjects, updateProjectStatus } from "@/lib/projects"

export default function ProjectsPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectType, setProjectType] = useState<"solar" | "fencing" | "service">("solar")
  const [customerId, setCustomerId] = useState("")
  const [employeeId, setEmployeeId] = useState("")
  const [address, setAddress] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])

  const loadData = () => {
    setCustomers(getCustomers())
    setEmployees(getEmployees())
    setProjects(getProjects())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddProject = () => {
    if (!title.trim() || !customerId || !employeeId) return

    const customer = customers.find((c) => c.id === customerId)
    const employee = employees.find((e) => e.employeeId === employeeId)

    const newProject = {
      id: Date.now().toString(),
      customerId,
      customerName: customer?.name || "",
      title: title.trim(),
      description: description.trim(),
      projectType,
      assignedEmployeeId: employeeId,
      assignedEmployeeName: employee?.name || "",
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
      address: address.trim(),
    }

    addProject(newProject)

    setTitle("")
    setDescription("")
    setProjectType("solar")
    setCustomerId("")
    setEmployeeId("")
    setAddress("")
    loadData()
  }

  const handleStatusChange = (
    projectId: string,
    status: "pending" | "ongoing" | "completed"
  ) => {
    updateProjectStatus(projectId, status)
    loadData()
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">Projects</h1>
        <p className="mt-2 text-slate-300">Create and assign customer projects</p>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Add Project</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project Description"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <select
          value={projectType}
          onChange={(e) =>
            setProjectType(e.target.value as "solar" | "fencing" | "service")
          }
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        >
          <option value="solar">Solar</option>
          <option value="fencing">Fencing</option>
          <option value="service">Service</option>
        </select>

        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        >
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.customerType})
            </option>
          ))}
        </select>

        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        >
          <option value="">Assign Employee</option>
          {employees.map((employee) => (
            <option key={employee.employeeId} value={employee.employeeId}>
              {employee.name} ({employee.employeeId})
            </option>
          ))}
        </select>

        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Project Address"
          className="w-full rounded-md bg-white px-4 py-3 text-black"
        />

        <button
          onClick={handleAddProject}
          className="rounded-md bg-green-500 px-5 py-3 font-semibold text-white"
        >
          Add Project
        </button>
      </div>

      <div className="space-y-4 rounded-xl bg-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">Project List</h2>

        {projects.length === 0 ? (
          <p className="text-slate-400">No projects added yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="rounded-lg border border-slate-700 p-4">
              <p className="font-semibold text-white">{project.title}</p>
              <p className="mt-1 text-sm text-slate-300">
                Customer: {project.customerName}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Employee: {project.assignedEmployeeName}
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
                  onClick={() => handleStatusChange(project.id, "pending")}
                  className="rounded bg-slate-600 px-3 py-2 text-sm text-white"
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusChange(project.id, "ongoing")}
                  className="rounded bg-blue-500 px-3 py-2 text-sm text-white"
                >
                  Ongoing
                </button>
                <button
                  onClick={() => handleStatusChange(project.id, "completed")}
                  className="rounded bg-green-500 px-3 py-2 text-sm text-white"
                >
                  Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}