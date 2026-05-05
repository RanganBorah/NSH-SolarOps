import Topbar from "@/components/layout/Topbar"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Topbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  )
}