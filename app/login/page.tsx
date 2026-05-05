"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { findEmployeeByCredentials } from "@/lib/employees"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    if (identifier.trim().toLowerCase() === "owner" && password === "owner123") {
      localStorage.setItem("nsh_user", JSON.stringify({ role: "owner" }))
      router.push("/owner/dashboard")
      return
    }

    const employee = findEmployeeByCredentials(identifier.trim(), password)

    if (employee) {
      localStorage.setItem(
        "nsh_user",
        JSON.stringify({
          role: "employee",
          name: employee.name,
          employeeId: employee.employeeId,
        })
      )

      router.push("/employee/dashboard")
      return
    }

    alert("Invalid login credentials")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-full max-w-md px-6">
        <div className="mb-6 flex justify-center">
          <img
            src="/logo.png"
            alt="Nagaon Solar House Logo"
            className="h-24 w-24 rounded-2xl object-contain"
          />
        </div>

        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          NSH SolarOps
        </h1>

        <p className="mb-6 text-center text-gray-300">
          Login using Phone / Email / Employee ID
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Phone / Email / Employee ID"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-white px-4 py-2 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-600 bg-white px-4 py-2 text-black"
          />

          <button
            onClick={handleLogin}
            className="w-full rounded-md bg-yellow-500 px-4 py-2 font-semibold text-black"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  )
}