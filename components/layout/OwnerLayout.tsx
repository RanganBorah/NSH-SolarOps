import Sidebar from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#0F172A] min-h-screen flex">
      
      <Sidebar />

      <div className="ml-64 flex-1 flex flex-col">
        
        <Topbar />

        <main className="p-6 flex justify-center">
          <div className="w-full max-w-5xl">
            {children}
          </div>
        </main>

      </div>
    </div>
  )
}