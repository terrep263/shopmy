'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BsPinMapFill, BsGraphUpArrow, BsSuitHeart, BsYelp, BsShop, BsGift, BsTicketPerforated, BsPeople } from "react-icons/bs"
import { AdminToolProvider } from '@/admin-tools/context'

interface AdminLayoutProps {
  children: React.ReactNode
  userName?: string
}

export default function AdminLayout({ children, userName = "Admin" }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const menuItems = [
    { href: '/admin/dashboard', icon: BsPinMapFill, label: 'Dashboard' },
    { href: '/admin/businesses', icon: BsShop, label: 'Businesses' },
    { href: '/admin/deals', icon: BsGift, label: 'Deals' },
    { href: '/admin/vouchers', icon: BsTicketPerforated, label: 'Vouchers' },
    { href: '/admin/vendors', icon: BsPeople, label: 'Vendors' },
    { href: '/admin/editor', icon: BsGraphUpArrow, label: 'Page Editor' },
  ]

  return (
    <AdminToolProvider>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold" href="/admin/dashboard">
            ShopMyNeighborhood Admin
          </Link>
          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="text-white-50">Welcome, {userName}</span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="p-0">
        <div className="container-fluid p-0">
          <div className="row user-dashboard g-0">
            {/* Sidebar */}
            <div className="col-xl-2 col-lg-3 col-md-12">
              <div className="sideBar bg-dark vh-100 position-sticky top-0">
                <div className="p-4">
                  <div className="d-flex flex-column gap-2">
                    {menuItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <Link 
                          key={index}
                          href={item.href}
                          className={`d-flex align-items-center gap-3 p-3 rounded text-decoration-none ${
                            isActive ? 'bg-primary text-white' : 'text-white-50 hover-bg-secondary'
                          }`}
                        >
                          <Icon className="fs-5" />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-xl-10 col-lg-9 col-md-12 pt-lg-0 pt-5">
              <div className="user-dashboard-box bg-light">
                {children}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminToolProvider>
  )
}
