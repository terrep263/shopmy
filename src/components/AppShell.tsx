"use client"

import { usePathname } from "next/navigation"
import Sidebar from "@/components/Sidebar"

const THEME_PATHS = ["/", "/explore"]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isThemeRoute = THEME_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))

  if (isThemeRoute) {
    return <>{children}</>
  }

  return (
    <>
      <Sidebar />
      <main className="app-main">{children}</main>
    </>
  )
}
