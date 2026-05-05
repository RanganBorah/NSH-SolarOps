"use client"

import Link from "next/link"
import {
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  ShoppingCart,
  UserRound,
  Users,
  Boxes,
  BarChart3,
  FileText,
  ReceiptText,
  Briefcase,
} from "lucide-react"

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-gray-800 bg-[#020617] px-5 py-6 text-white">
      <h1 className="mb-10 text-2xl font-bold text-yellow-400">
        NSH SolarOps
      </h1>

      <nav className="flex flex-col gap-2 text-sm">

        <Link href="/owner/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link href="/owner/work" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <Briefcase size={18} />
          Work Board
        </Link>

        <Link href="/owner/employees" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <Users size={18} />
          Employees
        </Link>

        <Link href="/owner/attendance" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <ClipboardCheck size={18} />
          Attendance
        </Link>

        <Link href="/owner/projects" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <FolderKanban size={18} />
          Projects
        </Link>

        <Link href="/owner/sales" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <ShoppingCart size={18} />
          Sales
        </Link>

        <Link href="/owner/quotations" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <FileText size={18} />
          Quotations
        </Link>

        <Link href="/owner/invoices" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <ReceiptText size={18} />
          Tax Invoice
        </Link>

        <Link href="/owner/inventory" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <Boxes size={18} />
          Inventory
        </Link>

        <Link href="/owner/customers" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <UserRound size={18} />
          Customers
        </Link>

        <Link href="/owner/reports" className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-800">
          <BarChart3 size={18} />
          Reports
        </Link>

      </nav>
    </div>
  )
}