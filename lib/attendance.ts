import { Attendance } from "@/types/attendance"

const STORAGE_KEY = "nsh_attendance"

export const getAttendance = (): Attendance[] => {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export const addAttendance = (attendance: Attendance) => {
  if (typeof window === "undefined") return

  const records = getAttendance()
  records.push(attendance)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
}

export const getTodayAttendanceByEmployee = (employeeId: string, date: string) => {
  const records = getAttendance()
  return records.find(
    (item) => item.employeeId === employeeId && item.date === date
  )
}

export const clearAttendance = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}