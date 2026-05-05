import { Project } from "@/types/project"

const STORAGE_KEY = "nsh_projects"

export const getProjects = (): Project[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addProject = (project: Project) => {
  if (typeof window === "undefined") return
  const projects = getProjects()
  projects.push(project)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}

export const getProjectsByEmployee = (employeeId: string) => {
  return getProjects().filter((project) => project.assignedEmployeeId === employeeId)
}

export const updateProjectStatus = (
  projectId: string,
  status: "pending" | "ongoing" | "completed"
) => {
  if (typeof window === "undefined") return
  const projects = getProjects().map((project) =>
    project.id === projectId ? { ...project, status } : project
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}