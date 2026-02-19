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
    const [activeTab, setActiveTab] = useState<'imports' | 'dealguard' | 'cities' | 'categories' | 'vendors' | 'vouchers' | 'logs'>('imports')

    const [cities, setCities] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [vendors, setVendors] = useState<any[]>([])
    const [vouchers, setVouchers] = useState<any[]>([])
    const [logs, setLogs] = useState<any[]>([])

    const [importCityId, setImportCityId] = useState('')
    const [importCategoryId, setImportCategoryId] = useState('')
    const [importLoading, setImportLoading] = useState(false)
    const [importResult, setImportResult] = useState<any>(null)

    const [newCityName, setNewCityName] = useState('')
    const [newCategoryName, setNewCategoryName] = useState('')
    const [newCategoryGoogleType, setNewCategoryGoogleType] = useState('')

    const [dealVendorId, setDealVendorId] = useState('')
    const [dealPrice, setDealPrice] = useState('')
    const [dealOriginalValue, setDealOriginalValue] = useState('')
    const [dealExpiration, setDealExpiration] = useState('')
    const [dealResult, setDealResult] = useState<any>(null)
    const [dealLoading, setDealLoading] = useState(false)

    const [voucherStatus, setVoucherStatus] = useState('')
    const [voucherPage, setVoucherPage] = useState(1)
    const [voucherTotal, setVoucherTotal] = useState(0)

    useEffect(() => {
        const opts = { credentials: "include" as RequestCredentials }

        Promise.all([
            fetch("/api/admin/vendors", opts).then(res => res.json()),
            fetch("/api/admin/deals", opts).then(res => res.json()),
            fetch("/api/admin/vouchers", opts).then(res => res.json()),
            fetch("/api/admin/businesses", opts).then(res => res.json().catch(() => [])),
            fetch("/api/admin/cities", opts).then(res => res.json()),
            fetch("/api/admin/categories", opts).then(res => res.json())
        ])
        .then(([vendorsRes, deals, vouchersRes, businesses, citiesRes, categoriesRes]) => {
            if (!Array.isArray(vendorsRes) || !Array.isArray(deals) || !Array.isArray(citiesRes) || !Array.isArray(categoriesRes)) {
                setError("Unauthorized. Please log in as admin.")
                return
            }

            setVendors(vendorsRes)
            setCities(citiesRes)
            setCategories(categoriesRes)
            setStats({
                vendors: vendorsRes.length,
                deals: Array.isArray(deals) ? deals.length : 0,
                vouchers: Array.isArray(vouchersRes?.items || vouchersRes) ? (vouchersRes?.items || vouchersRes).length : 0,
                businesses: Array.isArray(businesses) ? businesses.length : 0
            })
        })
        .catch(() => setError("Failed to load dashboard"))
    }, [])

    useEffect(() => {
        const opts = { credentials: "include" as RequestCredentials }
        fetch(`/api/admin/vouchers?page=${voucherPage}&pageSize=20${voucherStatus ? `&status=${voucherStatus}` : ''}`, opts)
            .then(res => res.json())
            .then(data => {
                if (data?.items) {
                    setVouchers(data.items)
                    setVoucherTotal(data.total || 0)
                }
            })
            .catch(() => null)
    }, [voucherPage, voucherStatus])

    useEffect(() => {
        const opts = { credentials: "include" as RequestCredentials }
        fetch(`/api/admin/logs?page=1&pageSize=20`, opts)
            .then(res => res.json())
            .then(data => {
                if (data?.items) setLogs(data.items)
            })
            .catch(() => null)
    }, [])

    const handleImportBusinesses = async () => {
        if (!importCityId || !importCategoryId) {
            alert('Please select both city and category')
            return
        }

        setImportLoading(true)
        setImportResult(null)

        try {
            const response = await fetch('/api/admin/import-city', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ cityId: importCityId, categoryId: importCategoryId })
            })

            const data = await response.json()

            if (response.ok) {
                setImportResult(data)
                const opts = { credentials: "include" as RequestCredentials }
                const businesses = await fetch("/api/admin/businesses", opts).then(res => res.json())
                setStats(prev => ({ ...prev, businesses: Array.isArray(businesses) ? businesses.length : 0 }))
            } else {
                alert(`Import failed: ${data.error}`)
            }
        } catch {
            alert('Import failed: Network error')
        } finally {
            setImportLoading(false)
        }
    }

    const handleCreateCity = async () => {
        if (!newCityName) return
        const res = await fetch('/api/admin/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: newCityName })
        })
        if (res.ok) {
            const city = await res.json()
            setCities(prev => [...prev, city])
            setNewCityName('')
        }
    }

    const handleToggleCity = async (id: string, active: boolean) => {
        const res = await fetch('/api/admin/cities', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, active })
        })
        if (res.ok) {
            const updated = await res.json()
            setCities(prev => prev.map(c => c.id === updated.id ? updated : c))
        }
    }

    const handleCreateCategory = async () => {
        if (!newCategoryName || !newCategoryGoogleType) return
        const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: newCategoryName, googleType: newCategoryGoogleType })
        })
        if (res.ok) {
            const category = await res.json()
            setCategories(prev => [...prev, category])
            setNewCategoryName('')
            setNewCategoryGoogleType('')
        }
    }

    const handleToggleCategory = async (id: string, active: boolean) => {
        const res = await fetch('/api/admin/categories', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id, active })
        })
        if (res.ok) {
            const updated = await res.json()
            setCategories(prev => prev.map(c => c.id === updated.id ? updated : c))
        }
    }

    const handleGenerateDeal = async () => {
        if (!dealVendorId || !dealPrice || !dealOriginalValue || !dealExpiration) return
        setDealLoading(true)
        setDealResult(null)
        try {
            const res = await fetch('/api/admin/deals/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    vendorId: dealVendorId,
                    price: Number(dealPrice),
                    originalValue: Number(dealOriginalValue),
                    expirationDate: dealExpiration
                })
            })
            const data = await res.json()
            if (res.ok) {
                setDealResult(data)
            } else {
                alert(data.error || 'Deal generation failed')
            }
        } finally {
            setDealLoading(false)
        }
    }

    const handleUpdateVendorStatus = async (vendorId: string, status: string) => {
        const res = await fetch('/api/admin/vendors', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ vendorId, status })
        })
        if (res.ok) {
            const data = await res.json()
            setVendors(prev => prev.map(v => v.id === data.vendor.id ? data.vendor : v))
        }
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="p-5">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </AdminLayout>
        )
    }

    const counterData = [
        { ...adminCounter[0], number: stats.businesses },
        { ...adminCounter[1], number: stats.deals },
        { ...adminCounter[2], number: stats.vouchers },
        { ...adminCounter[3], number: stats.vendors },
    ]

    return (
        <AdminLayout>
            <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 pt-lg-0 pt-5">
                <h2 className="fw-medium mb-0">Hello, Admin</h2>
            </div>
            
            <div className="dashCaption p-xl-5 p-3 p-md-4">
                <div className="row align-items-start g-4 mb-4">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <div className="alert alert-primary alert-dismissible fade show" role="alert">
                            Welcome to your <strong>Admin Dashboard</strong> for ShopMyNeighborhood!
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    </div>
                </div>

                <div className="row align-items-start g-4 mb-lg-4 mb-3">
                    {counterData.map((item: Counter, index: number) => {
                        const Icon = item.icon
                        return (
                            <div className="col-xl-3 col-lg-6 col-md-6 col-sm-6" key={index}>
                                <div className="card rounded-3 position-relative p-4">
                                    <div className={`position-absolute w-30 h-100 start-0 top-0 rounded-end-pill ${item.bg}`}>
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                            <Icon className={`fs-2 ${item.iconStyle}`}></Icon>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column align-items-end justify-content-end ht-80">
                                        <h2 className="mb-0">
                                            <CountUp className="ctr" end={item.number} />{item.symbol}
                                        </h2>
                                        <p className="text-muted-2 fw-medium mb-0">{item.title}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="card rounded-3 shadow-sm mb-4">
                    <div className="card-body">
                        <ul className="nav nav-tabs">
                            {[
                                { key: 'imports', label: 'Imports' },
                                { key: 'dealguard', label: 'DealGuard Studio' },
                                { key: 'cities', label: 'Cities' },
                                { key: 'categories', label: 'Categories' },
                                { key: 'vendors', label: 'Vendors' },
                                { key: 'vouchers', label: 'Vouchers' },
                                { key: 'logs', label: 'Admin Logs' }
                            ].map(tab => (
                                <li className="nav-item" key={tab.key}>
                                    <button
                                        className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                                        onClick={() => setActiveTab(tab.key as any)}
                                    >
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {activeTab === 'imports' && (
                    <div className="card rounded-3 shadow-sm mb-4">
                        <div className="card-header py-3 px-4">
                            <h4 className="m-0">Import Businesses</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">City</label>
                                    <select className="form-select" value={importCityId} onChange={(e) => setImportCityId(e.target.value)}>
                                        <option value="">Select city</option>
                                        {cities.filter(c => c.active).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Category</label>
                                    <select className="form-select" value={importCategoryId} onChange={(e) => setImportCategoryId(e.target.value)}>
                                        <option value="">Select category</option>
                                        {categories.filter(c => c.active).map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button className="btn btn-primary mt-3" onClick={handleImportBusinesses} disabled={importLoading}>
                                {importLoading ? 'Importing...' : 'Run Import'}
                            </button>

                            {importResult && (
                                <div className="alert alert-success mt-3 mb-0">
                                    <strong>Import Complete</strong>
                                    <ul className="mb-0 mt-2">
                                        <li>Total Fetched: {importResult.totalFetched}</li>
                                        <li>Created: {importResult.created}</li>
                                        <li>Skipped: {importResult.skipped}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'dealguard' && (
                    <div className="card rounded-3 shadow-sm mb-4">
                        <div className="card-header py-3 px-4">
                            <h4 className="m-0">DealGuard Studio</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Vendor</label>
                                    <select className="form-select" value={dealVendorId} onChange={(e) => setDealVendorId(e.target.value)}>
                                        <option value="">Select vendor</option>
                                        {vendors.map(v => (
                                            <option key={v.id} value={v.id}>{v.user?.email || v.business?.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Price</label>
                                    <input className="form-control" value={dealPrice} onChange={(e) => setDealPrice(e.target.value)} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Original Value</label>
                                    <input className="form-control" value={dealOriginalValue} onChange={(e) => setDealOriginalValue(e.target.value)} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Expiration Date</label>
                                    <input type="date" className="form-control" value={dealExpiration} onChange={(e) => setDealExpiration(e.target.value)} />
                                </div>
                            </div>
                            <button className="btn btn-primary mt-3" onClick={handleGenerateDeal} disabled={dealLoading}>
                                {dealLoading ? 'Generating...' : 'Generate Deal'}
                            </button>
                            {dealResult?.deal && (
                                <div className="alert alert-success mt-3 mb-0">
                                    <strong>Deal Created:</strong> {dealResult.deal.title}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'cities' && (
                    <div className="card rounded-3 shadow-sm mb-4">
                        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
                            <h4 className="m-0">Cities</h4>
                            <div className="d-flex gap-2">
                                <input className="form-control form-control-sm" placeholder="New city" value={newCityName} onChange={(e) => setNewCityName(e.target.value)} />
                                <button className="btn btn-sm btn-primary" onClick={handleCreateCity}>Add</button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Status</th>
                                            <th>Last Imported</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cities.map(city => (
                                            <tr key={city.id}>
                                                <td>{city.name}</td>
                                                <td>{city.active ? 'Active' : 'Inactive'}</td>
                                                <td>{city.last_imported_at ? new Date(city.last_imported_at).toLocaleDateString() : '—'}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleToggleCity(city.id, !city.active)}>
                                                        {city.active ? 'Disable' : 'Enable'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="card rounded-3 shadow-sm mb-4">
                        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
                            <h4 className="m-0">Categories</h4>
                            <div className="d-flex gap-2">
                                <input className="form-control form-control-sm" placeholder="Name" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                                <input className="form-control form-control-sm" placeholder="Google type" value={newCategoryGoogleType} onChange={(e) => setNewCategoryGoogleType(e.target.value)} />
                                <button className="btn btn-sm btn-primary" onClick={handleCreateCategory}>Add</button>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Name</th>
                                            <th>Google Type</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(cat => (
                                            <tr key={cat.id}>
                                                <td>{cat.name}</td>
                                                <td>{cat.google_type}</td>
                                                <td>{cat.active ? 'Active' : 'Inactive'}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleToggleCategory(cat.id, !cat.active)}>
                                                        {cat.active ? 'Disable' : 'Enable'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'vendors' && (
                    <div className="card rounded-3 shadow-sm mb-4">
                        <div className="card-header py-3 px-4">
                            <h4 className="m-0">Vendors</h4>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Business</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vendors.map(v => (
                                            <tr key={v.id}>
                                                <td>{v.user?.email || '—'}</td>
                                                <td>{v.business?.name || '—'}</td>
                                                <td>{v.subscription_status}</td>
                                                <td>
                                                    {v.subscription_status !== 'inactive' ? (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleUpdateVendorStatus(v.id, 'inactive')}>Suspend</button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => handleUpdateVendorStatus(v.id, 'active')}>Reactivate</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'vouchers' && (
                    <div className="card rounded-3 shadow-sm mb-4">
                        <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
                            <h4 className="m-0">Vouchers</h4>
                            <select className="form-select form-select-sm w-auto" value={voucherStatus} onChange={(e) => setVoucherStatus(e.target.value)}>
                                <option value="">All</option>
                                <option value="issued">Issued</option>
                                <option value="redeemed">Redeemed</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>UUID</th>
                                            <th>Deal</th>
                                            <th>Vendor</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vouchers.map(v => (
                                            <tr key={v.id}>
                                                <td>{String(v.uuid).slice(0, 12)}...</td>
                                                <td>{v.deal?.title}</td>
                                                <td>{v.deal?.vendor?.business?.name}</td>
                                                <td>{v.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-3 d-flex justify-content-between">
                                <button className="btn btn-sm btn-outline-secondary" disabled={voucherPage <= 1} onClick={() => setVoucherPage(p => Math.max(1, p - 1))}>Prev</button>
                                <span>Page {voucherPage} / {Math.max(1, Math.ceil(voucherTotal / 20))}</span>
                                <button className="btn btn-sm btn-outline-secondary" disabled={voucherPage >= Math.ceil(voucherTotal / 20)} onClick={() => setVoucherPage(p => p + 1)}>Next</button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="card rounded-3 shadow-sm mb-4">
                        <div className="card-header py-3 px-4">
                            <h4 className="m-0">Admin Logs</h4>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Admin</th>
                                            <th>Action</th>
                                            <th>Entity</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map(l => (
                                            <tr key={l.id}>
                                                <td>{l.admin?.email}</td>
                                                <td>{l.action_type}</td>
                                                <td>{l.entity_type}</td>
                                                <td>{new Date(l.created_at).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    </AdminLayout>
  )
}
