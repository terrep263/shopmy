/**
 * Voucher Manager Tool Page
 * 
 * View and manage customer vouchers
 */
'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Voucher {
  id: number
  code: string
  status: string
  redeemed_at: string | null
  expires_at: string
  created_at: string
  deal?: {
    title: string
    price: number
  }
  user?: {
    email: string
  }
}

interface VoucherResponse {
  items: Voucher[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function VoucherManagerPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    loadVouchers()
  }, [page, filterStatus])

  const loadVouchers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const statusParam = filterStatus !== 'all' ? `&status=${filterStatus}` : ''
      const res = await fetch(`/api/admin/vouchers?page=${page}&pageSize=20${statusParam}`, {
        credentials: 'include'
      })
      
      const data: VoucherResponse = await res.json()
      
      if (data?.items) {
        setVouchers(data.items)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      setError('Failed to load vouchers')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success'
      case 'REDEEMED':
        return 'bg-primary'
      case 'EXPIRED':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Voucher Manager</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">All Vouchers ({total})</h5>
                  <div>
                    <label className="me-2">Filter:</label>
                    <select
                      className="form-select form-select-sm d-inline-block w-auto"
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value)
                        setPage(1)
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="ACTIVE">Active</option>
                      <option value="REDEEMED">Redeemed</option>
                      <option value="EXPIRED">Expired</option>
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
            ) : vouchers.length === 0 ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <p className="text-muted mb-0">No vouchers found with selected filter.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Customer</th>
                            <th>Deal</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Expires</th>
                            <th>Redeemed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vouchers.map((voucher) => (
                            <tr key={voucher.id}>
                              <td>{voucher.id}</td>
                              <td><code>{voucher.code}</code></td>
                              <td>{voucher.user?.email || 'N/A'}</td>
                              <td>{voucher.deal?.title || 'N/A'}</td>
                              <td>${voucher.deal?.price || 0}</td>
                              <td>
                                <span className={`badge ${getStatusBadgeClass(voucher.status)}`}>
                                  {voucher.status}
                                </span>
                                {voucher.status === 'ACTIVE' && isExpired(voucher.expires_at) && (
                                  <span className="badge bg-warning ms-1">Expired</span>
                                )}
                              </td>
                              <td>
                                {new Date(voucher.expires_at).toLocaleDateString()}
                              </td>
                              <td>
                                {voucher.redeemed_at 
                                  ? new Date(voucher.redeemed_at).toLocaleDateString()
                                  : '-'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    Showing page {page} of {totalPages}
                  </div>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title">About Vouchers</h5>
                <p>
                  Vouchers are generated when customers purchase deals. Each voucher has a unique code that can 
                  be redeemed at the vendor&apos;s business.
                </p>
                <h6>Voucher Status Types:</h6>
                <ul>
                  <li><span className="badge bg-success">ACTIVE</span> - Voucher is valid and can be redeemed</li>
                  <li><span className="badge bg-primary">REDEEMED</span> - Voucher has been used at the business</li>
                  <li><span className="badge bg-danger">EXPIRED</span> - Voucher has passed its expiration date</li>
                </ul>
                <p className="mb-0">
                  <strong>Note:</strong> Vouchers automatically expire based on the deal&apos;s expiration date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
