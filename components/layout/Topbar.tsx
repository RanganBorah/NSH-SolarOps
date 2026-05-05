"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Topbar() {
  const [time, setTime] = useState("")
  const router = useRouter()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      const day = String(now.getDate()).padStart(2, "0")
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const year = now.getFullYear()

      let hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")

      const ampm = hours >= 12 ? "PM" : "AM"
      hours = hours % 12
      hours = hours ? hours : 12

      const formatted = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`

      setTime(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("nsh_user")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Nagaon Solar House Logo"
            className="h-12 w-12 rounded-xl object-contain"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              NSH SolarOps
            </h1>
            <p className="text-sm text-slate-400">
              Solar operations control center
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2 text-right sm:block">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Live Time
            </p>
            <p className="text-sm font-semibold text-amber-400">
              {time}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-red-500 px-5 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}