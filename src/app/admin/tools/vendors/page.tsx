/**
 * Vendor Manager Tool Page
 * 
 * Review and manage vendor accounts and status
 */
'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Vendor {
  id: number
  user_id: number
  business_id: number | null
  status: string
  created_at: string
  user?: {
    email: string
  }
  business?: {
    name: string
    address: string
  }
}

export default function VendorManagerPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/vendors', {
        credentials: 'include'
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setVendors(data)
      }
    } catch (err) {
      setError('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (vendorId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vendorId, status: newStatus })
      })

      if (res.ok) {
        loadVendors()
      } else {
        alert('Failed to update vendor status')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  const filteredVendors = filterStatus === 'all' 
    ? vendors 
    : vendors.filter(v => v.status === filterStatus)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-success'
      case 'PENDING':
        return 'bg-warning'
      case 'REJECTED':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Vendor Manager</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">All Vendors ({filteredVendors.length})</h5>
                  <div>
                    <label className="me-2">Filter:</label>
                    <select
                      className="form-select form-select-sm d-inline-block w-auto"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : filteredVendors.length === 0 ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <p className="text-muted mb-0">No vendors found with selected filter.</p>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Email</th>
                          <th>Business</th>
                          <th>Address</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVendors.map((vendor) => (
                          <tr key={vendor.id}>
                            <td>{vendor.id}</td>
                            <td>{vendor.user?.email || 'N/A'}</td>
                            <td>
                              {vendor.business?.name || (
                                <span className="text-muted">No business</span>
                              )}
                            </td>
                            <td>
                              {vendor.business?.address || (
                                <span className="text-muted">N/A</span>
                              )}
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(vendor.status)}`}>
                                {vendor.status}
                              </span>
                            </td>
                            <td>{new Date(vendor.created_at).toLocaleDateString()}</td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                {vendor.status !== 'APPROVED' && (
                                  <button
                                    className="btn btn-success"
                                    onClick={() => handleUpdateStatus(vendor.id, 'APPROVED')}
                                  >
                                    Approve
                                  </button>
                                )}
                                {vendor.status !== 'REJECTED' && (
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => handleUpdateStatus(vendor.id, 'REJECTED')}
                                  >
                                    Reject
                                  </button>
                                )}
                                {vendor.status !== 'PENDING' && (
                                  <button
                                    className="btn btn-warning"
                                    onClick={() => handleUpdateStatus(vendor.id, 'PENDING')}
                                  >
                                    Pending
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title">About Vendor Management</h5>
                <p>
                  Vendors are business owners who have claimed a business in the platform. They can create deals 
                  and manage their business profile.
                </p>
                <h6>Vendor Status Types:</h6>
                <ul>
                  <li><span className="badge bg-warning">PENDING</span> - Vendor claim is awaiting admin review</li>
                  <li><span className="badge bg-success">APPROVED</span> - Vendor can create deals and manage business</li>
                  <li><span className="badge bg-danger">REJECTED</span> - Vendor claim was denied (vendor cannot access business)</li>
                </ul>
                <p className="mb-0">
                  <strong>Note:</strong> Only approved vendors can create deals for their business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
