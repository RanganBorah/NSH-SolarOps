import { Employee } from "@/types/employee"

const STORAGE_KEY = "nsh_employees"

export const getEmployees = (): Employee[] => {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addEmployee = (employee: Employee) => {
  if (typeof window === "undefined") return

  const employees = getEmployees()
  employees.push(employee)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
}

export const findEmployeeByCredentials = (
  identifier: string,
  password: string
) => {
  const employees = getEmployees()

  return employees.find(
    (emp) =>
      (emp.employeeId === identifier || emp.phone === identifier) &&
      emp.password === password
  )
}