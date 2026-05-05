import "./globals.css"

export const metadata = {
  title: "NSH SolarOps",
  description: "Solar Business Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0F172A] text-white antialiased">
        {children}
      </body>
    </html>
  )
}