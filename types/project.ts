export interface Project {
  id: string
  customerId: string
  customerName: string
  title: string
  description: string
  projectType: "solar" | "fencing" | "service"
  assignedEmployeeId: string
  assignedEmployeeName: string
  status: "pending" | "ongoing" | "completed"
  date: string
  address: string
}