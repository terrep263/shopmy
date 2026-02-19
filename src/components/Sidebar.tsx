"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "@/components/Logo"

export default function Sidebar() {
  const path = usePathname()

  const linkClass = (href: string) =>
    `list-group-item list-group-item-action d-flex align-items-center ${path === href ? "active" : ""}`

  return (
    <div className="app-sidebar position-fixed start-0 top-0 bg-white shadow h-100 overflow-auto">
      <div className="p-4 border-bottom d-flex align-items-center">
        <Logo size={40} />
        <span className="fw-bold text-primary ms-2">ShopMyNeighborhood</span>
      </div>
      <div className="list-group list-group-flush rounded-0">
        <Link href="/" className={linkClass("/")}>Home</Link>
        <Link href="/deals" className={linkClass("/deals")}>Marketplace</Link>
        <Link href="/business" className={linkClass("/business")}>Businesses</Link>
        <Link href="/vendor/dashboard" className={linkClass("/vendor/dashboard")}>Vendor Dashboard</Link>
        <Link href="/vendor/deals" className={linkClass("/vendor/deals")}>Deals</Link>
        <Link href="/vendor/vouchers" className={linkClass("/vendor/vouchers")}>Vouchers</Link>
        <Link href="/admin/dashboard" className={linkClass("/admin/dashboard")}>Admin Dashboard</Link>
        <Link href="/admin/tools" className={linkClass("/admin/tools")}>🔧 Admin Tools</Link>
        <Link href="/admin/branding" className={linkClass("/admin/branding")}>🎨 Branding</Link>
      </div>
    </div>
  )
}
