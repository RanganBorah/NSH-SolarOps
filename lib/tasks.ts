import { Task } from "@/types/task"

const STORAGE_KEY = "nsh_tasks"

export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addTask = (task: Task) => {
  if (typeof window === "undefined") return
  const tasks = getTasks()
  tasks.push(task)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const getTasksByEmployee = (employeeId: string) => {
  return getTasks().filter((task) => task.employeeId === employeeId)
}

export const updateTaskStatus = (taskId: string, status: "pending" | "completed") => {
  if (typeof window === "undefined") return
  const tasks = getTasks().map((task) =>
    task.id === taskId ? { ...task, status } : task
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const getPendingTasksCount = () => {
  return getTasks().filter((task) => task.status === "pending").length
}

export const getCompletedTasksCount = () => {
  return getTasks().filter((task) => task.status === "completed").length
}