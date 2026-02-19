"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import Link from "next/link"

export default function AdminVouchersPage() {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/vouchers?page=1&pageSize=50", { credentials: "include" })
      .then(res => {
        if (!res.ok) return null
        return res.json()
      })
      .then(result => {
        if (result == null) setError("Unauthorized")
        else setData(Array.isArray(result?.items) ? result.items : [])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load")
        setLoading(false)
      })
  }, [])

  if (error) {
    return (
      <AdminLayout>
        <div className="p-5">
          <div className="alert alert-danger">{error}</div>
          <Link href="/admin/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 pt-lg-0 pt-5">
        <h2 className="fw-medium mb-0">Manage Vouchers</h2>
      </div>
      
      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="row align-items-start g-4 mb-4">
          <div className="col-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
                <h4 className="m-0">All Vouchers</h4>
                <button className="btn btn-primary btn-sm">Generate Vouchers</button>
              </div>
              
              <div className="card-body p-0">
                {loading ? (
                  <div className="p-4 text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : data.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    No vouchers found.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>UUID</th>
                          <th>Business</th>
                          <th>Status</th>
                          <th>Redeemed</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map(voucher => (
                          <tr key={voucher.id}>
                            <td className="fw-medium font-monospace small">{voucher.uuid?.substring(0, 13)}...</td>
                            <td>{voucher.deal?.vendor?.business?.name || 'N/A'}</td>
                            <td>
                              {voucher.status === "redeemed" ? (
                                <span className="badge bg-secondary">Redeemed</span>
                              ) : voucher.status === "expired" ? (
                                <span className="badge bg-warning">Expired</span>
                              ) : (
                                <span className="badge bg-success">Issued</span>
                              )}
                            </td>
                            <td>{voucher.status === "redeemed" ? new Date(voucher.issued_at).toLocaleDateString() : '-'}</td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-2">View</button>
                              <button className="btn btn-sm btn-outline-danger">Revoke</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
