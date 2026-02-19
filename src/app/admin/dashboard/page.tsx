/**
 * Admin Dashboard - Tool Registry Based
 * 
 * Centralized admin dashboard using the tool registry system
 */
'use client'
import React, { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { BsPinMapFill, BsGraphUpArrow, BsSuitHeart, BsYelp } from "react-icons/bs"
import CountUp from 'react-countup'
import { IconType } from 'react-icons'
import { getToolsByAllCategories } from '@/admin-tools/registry'
import type { AdminTool } from '@/admin-tools/types'

interface Counter {
    icon: IconType
    iconStyle: string
    number: number
    symbol: string
    title: string
    bg: string
}

const adminCounter: Counter[] = [
    {
        icon: BsPinMapFill,
        iconStyle: 'text-success',
        number: 0,
        symbol: '',
        title: 'Active Businesses',
        bg: 'bg-light-success'
    },
    {
        icon: BsGraphUpArrow,
        iconStyle: 'text-danger',
        number: 0,
        symbol: '',
        title: 'Total Deals',
        bg: 'bg-light-danger'
    },
    {
        icon: BsSuitHeart,
        iconStyle: 'text-warning',
        number: 0,
        symbol: '',
        title: 'Total Vouchers',
        bg: 'bg-light-warning'
    },
    {
        icon: BsYelp,
        iconStyle: 'text-info',
        number: 0,
        symbol: '',
        title: 'Active Vendors',
        bg: 'bg-light-info'
    },
]

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        vendors: 0,
        deals: 0,
        vouchers: 0,
        businesses: 0
    })
    const [error, setError] = useState<string | null>(null)

    // Get all tools organized by category
    const toolsByCategory = getToolsByAllCategories()

    useEffect(() => {
        const opts = { credentials: "include" as RequestCredentials }

        Promise.all([
            fetch("/api/admin/vendors", opts).then(res => res.json()),
            fetch("/api/admin/deals", opts).then(res => res.json()),
            fetch("/api/admin/vouchers", opts).then(res => res.json()),
            fetch("/api/admin/businesses", opts).then(res => res.json().catch(() => [])),
        ])
        .then(([vendorsRes, deals, vouchersRes, businesses]) => {
            if (!Array.isArray(vendorsRes)) {
                setError("Unauthorized. Please log in as admin.")
                return
            }

            setStats({
                vendors: vendorsRes.length,
                deals: Array.isArray(deals) ? deals.length : 0,
                vouchers: Array.isArray(vouchersRes?.items || vouchersRes) ? (vouchersRes?.items || vouchersRes).length : 0,
                businesses: Array.isArray(businesses) ? businesses.length : 0
            })
        })
        .catch(() => setError("Failed to load dashboard"))
    }, [])

    const updatedCounter = [
        { ...adminCounter[0], number: stats.businesses },
        { ...adminCounter[1], number: stats.deals },
        { ...adminCounter[2], number: stats.vouchers },
        { ...adminCounter[3], number: stats.vendors },
    ]

    const getCategoryTitle = (category: string) => {
        switch (category) {
            case 'operations': return 'Platform Operations'
            case 'content': return 'Content Management'
            case 'management': return 'Account Management'
            case 'reports': return 'Reports & Logs'
            default: return category
        }
    }

    const getCategoryDescription = (category: string) => {
        switch (category) {
            case 'operations': return 'Import businesses and generate deals'
            case 'content': return 'Manage cities and categories'
            case 'management': return 'Manage vendors and vouchers'
            case 'reports': return 'View admin action logs'
            default: return ''
        }
    }

    const getIconForTool = (iconName: string) => {
        // Map Material Design icon names to emoji for now
        // In production, you'd use an icon library
        const iconMap: Record<string, string> = {
            'mdi-import': '📥',
            'mdi-shield-check': '🛡️',
            'mdi-city': '🏙️',
            'mdi-tag-multiple': '🏷️',
            'mdi-store': '🏪',
            'mdi-ticket-confirmation': '🎫',
            'mdi-file-document-multiple': '📋',
        }
        return iconMap[iconName] || '🔧'
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="container-fluid">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="layout-specing">
                    <div className="d-md-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Platform Admin Dashboard</h5>
                        <div className="mt-3 mt-md-0">
                            <a href="/admin/branding" className="btn btn-sm btn-outline-primary me-2">
                                🎨 Branding
                            </a>
                            <a href="/admin/editor" className="btn btn-sm btn-outline-primary">
                                ✏️ Page Editor
                            </a>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="row row-cols-xl-4 row-cols-md-2 row-cols-1 mt-4">
                        {updatedCounter.map((item, index) => {
                            const Icon = item.icon
                            return (
                                <div className="col" key={index}>
                                    <div className="card shadow-sm border-0 p-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="text-muted mb-1">{item.title}</h6>
                                                <h4 className="mb-0 fw-bold">
                                                    <CountUp
                                                        start={0}
                                                        end={item.number}
                                                        duration={2.5}
                                                    />
                                                    {item.symbol}
                                                </h4>
                                            </div>
                                            <div className={`${item.bg} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                                                <Icon className={`${item.iconStyle} fs-4`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Quick Access Cards */}
                    <div className="mt-5">
                        <div className="mb-3">
                            <h5 className="mb-1">Quick Access</h5>
                            <p className="text-muted mb-0">Frequently used modules</p>
                        </div>
                        <div className="row g-3">
                            <div className="col-lg-3 col-md-6">
                                <a href="/admin/businesses" className="text-decoration-none">
                                    <div className="card shadow-sm border-0 h-100 hover-card">
                                        <div className="card-body text-center">
                                            <div className="fs-1 mb-2">🏢</div>
                                            <h6 className="mb-1">Businesses</h6>
                                            <small className="text-muted">Manage all businesses</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <a href="/admin/deals" className="text-decoration-none">
                                    <div className="card shadow-sm border-0 h-100 hover-card">
                                        <div className="card-body text-center">
                                            <div className="fs-1 mb-2">🎯</div>
                                            <h6 className="mb-1">Deals</h6>
                                            <small className="text-muted">View all deals</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <a href="/admin/vendors" className="text-decoration-none">
                                    <div className="card shadow-sm border-0 h-100 hover-card">
                                        <div className="card-body text-center">
                                            <div className="fs-1 mb-2">👥</div>
                                            <h6 className="mb-1">Vendors</h6>
                                            <small className="text-muted">Manage vendors</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <a href="/admin/vouchers" className="text-decoration-none">
                                    <div className="card shadow-sm border-0 h-100 hover-card">
                                        <div className="card-body text-center">
                                            <div className="fs-1 mb-2">🎫</div>
                                            <h6 className="mb-1">Vouchers</h6>
                                            <small className="text-muted">View all vouchers</small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Tool Cards by Category */}
                    {Object.entries(toolsByCategory).map(([category, tools]) => {
                        if (tools.length === 0) return null
                        
                        return (
                            <div key={category} className="mt-5">
                                <div className="mb-3">
                                    <h5 className="mb-1">{getCategoryTitle(category)}</h5>
                                    <p className="text-muted mb-0">{getCategoryDescription(category)}</p>
                                </div>
                                
                                <div className="row g-3">
                                    {tools.map((tool: AdminTool) => (
                                        <div key={tool.id} className="col-lg-4 col-md-6">
                                            <div className="card shadow-sm border-0 h-100">
                                                <div className="card-body d-flex flex-column">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <div 
                                                            className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                                                            style={{ width: '48px', height: '48px', fontSize: '24px' }}
                                                        >
                                                            {getIconForTool(tool.icon)}
                                                        </div>
                                                        <div>
                                                            <h6 className="mb-1">{tool.name}</h6>
                                                            <p className="text-muted small mb-0">{tool.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-auto">
                                                        <a 
                                                            href={tool.route} 
                                                            className="btn btn-primary btn-sm w-100"
                                                        >
                                                            Launch Tool →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}

                    {/* Platform Customization Section */}
                    <div className="mt-5">
                        <div className="mb-3">
                            <h5 className="mb-1">Platform Customization</h5>
                            <p className="text-muted mb-0">Customize your platform appearance and content</p>
                        </div>
                        <div className="row g-3">
                            <div className="col-lg-4 col-md-6">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex align-items-start mb-3">
                                            <div 
                                                className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{ width: '48px', height: '48px', fontSize: '24px' }}
                                            >
                                                🎨
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Branding Manager</h6>
                                                <p className="text-muted small mb-0">Customize colors, logos, and site name</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto">
                                            <a 
                                                href="/admin/branding" 
                                                className="btn btn-primary btn-sm w-100"
                                            >
                                                Launch Tool →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex align-items-start mb-3">
                                            <div 
                                                className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{ width: '48px', height: '48px', fontSize: '24px' }}
                                            >
                                                ✏️
                                            </div>
                                            <div>
                                                <h6 className="mb-1">Page Editor</h6>
                                                <p className="text-muted small mb-0">Visual drag & drop page editor with 24+ components</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto">
                                            <a 
                                                href="/admin/editor" 
                                                className="btn btn-primary btn-sm w-100"
                                            >
                                                Launch Editor →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Footer */}
                    <div className="card shadow-sm border-0 mt-5">
                        <div className="card-body">
                            <h6 className="mb-3">About Admin Dashboard</h6>
                            <p className="text-muted mb-3">
                                This dashboard provides centralized access to all platform administration tools. 
                                Each tool is designed for specific admin operations and can be launched independently. 
                                All admin actions are logged for audit purposes.
                            </p>
                            <div className="d-flex gap-2 flex-wrap">
                                <span className="badge bg-light text-dark">7 Admin Tools</span>
                                <span className="badge bg-light text-dark">Visual Editor</span>
                                <span className="badge bg-light text-dark">Branding Manager</span>
                                <span className="badge bg-light text-dark">Real-time Stats</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hover-card {
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .hover-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
            `}</style>
        </AdminLayout>
    )
}
