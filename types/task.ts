export interface Task {
  id: string
  title: string
  description: string
  employeeId: string
  employeeName: string
  status: "pending" | "completed"
  date: string
}