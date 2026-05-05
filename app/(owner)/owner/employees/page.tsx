"use client"

import { useEffect, useState } from "react"
import { addEmployee, getEmployees } from "@/lib/employees"

export default function EmployeesPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("")
  const [salary, setSalary] = useState("")
  const [employees, setEmployees] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setEmployees(getEmployees())
  }, [])

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) return

    const employeeNumber = employees.length + 1
    const generatedEmployeeId = `NSH${String(employeeNumber).padStart(3, "0")}`
    const generatedPassword = `${name.trim().split(" ")[0].toLowerCase()}123`

    const newEmployee = {
      id: Date.now().toString(),
      employeeId: generatedEmployeeId,
      name: name.trim(),
      phone: phone.trim(),
      role: role.trim(),
      salary: Number(salary) || 0,
      password: generatedPassword,
      isActive: true,
    }

    addEmployee(newEmployee)
    setEmployees([...getEmployees()])

    setName("")
    setPhone("")
    setRole("")
    setSalary("")
  }

  if (!mounted) return null

  return (
    <div className="w-full max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Employees</h1>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Employee Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-600 bg-white px-4 py-3 text-black"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-slate-600 bg-white px-4 py-3 text-black"
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-slate-600 bg-white px-4 py-3 text-black"
          />

          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full rounded-md border border-slate-600 bg-white px-4 py-3 text-black"
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 rounded-md bg-yellow-500 px-5 py-3 font-semibold text-black"
        >
          Add Employee
        </button>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
        {employees.length === 0 ? (
          <p className="text-slate-300">No employees added yet.</p>
        ) : (
          <div className="space-y-4">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="rounded-lg border border-slate-700 bg-slate-900 p-4"
              >
                <p className="text-lg font-semibold text-white">{emp.name}</p>
                <p className="text-sm text-slate-300">Phone: {emp.phone}</p>
                <p className="text-sm text-slate-300">Role: {emp.role || "-"}</p>
                <p className="text-sm text-slate-300">Salary: ₹{emp.salary}</p>
                <p className="text-sm text-slate-300">
                  Employee ID: {emp.employeeId}
                </p>
                <p className="text-sm text-slate-300">
                  Password: {emp.password}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}