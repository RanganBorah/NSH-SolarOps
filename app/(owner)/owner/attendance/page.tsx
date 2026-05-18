"use client"

import { useEffect, useState } from "react"
import { getAttendance } from "@/lib/attendance"

export default function AttendancePage() {
  const [mounted, setMounted] = useState(false)
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    setMounted(true)
    setRecords(getAttendance())
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Attendance</h1>

      <div className="rounded-xl bg-slate-800 p-6">
        {records.length === 0 ? (
          <p className="text-slate-300">No attendance records yet.</p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border border-slate-700 p-4"
              >
                <p className="font-semibold text-white">
                  {record.employeeName || record.name || "-"}
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Employee ID: {record.employeeId || "-"}
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Date: {record.date || record.attendanceDate || "-"}
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Time: {record.time || record.checkInTime || record.createdAt || "-"}
                </p>

                <p className="mt-1 text-sm text-slate-300">
                  Status: {record.status || "Present"}
                </p>

                {record.photo && (
                  <img
                    src={record.photo}
                    alt="Attendance Photo"
                    className="mt-3 h-32 w-32 rounded-lg object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}