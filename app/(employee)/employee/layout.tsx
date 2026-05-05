import EmployeeLayout from "@/components/layout/EmployeeLayout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <EmployeeLayout>{children}</EmployeeLayout>
}