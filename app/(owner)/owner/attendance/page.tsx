"use client"

import { useEffect, useState } from "react"
import { getAttendance } from "@/lib/attendance"

export default function AttendancePage() {
  const [records, setRecords] = useState(getAttendance())

  useEffect(() => {
    setRecords(getAttendance())
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Attendance</h1>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
        {records.length === 0 ? (
          <p className="text-slate-300">No attendance records yet.</p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border border-slate-700 bg-slate-900 p-4"
              >
                <p className="text-white font-semibold">{record.employeeName}</p>
                <p className="text-sm text-slate-300">Employee ID: {record.employeeId}</p>
                <p className="text-sm text-slate-300">Date: {record.date}</p>
                <p className="text-sm text-green-400">Status: {record.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}