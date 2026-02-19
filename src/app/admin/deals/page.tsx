"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import Link from "next/link"

export default function AdminDealsPage() {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/deals", { credentials: "include" })
      .then(res => {
        if (!res.ok) return null
        return res.json()
      })
      .then(result => {
        if (result == null) setError("Unauthorized")
        else setData(Array.isArray(result) ? result : [])
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
        <h2 className="fw-medium mb-0">Manage Deals</h2>
      </div>
      
      <div className="dashCaption p-xl-5 p-3 p-md-4">
        <div className="row align-items-start g-4 mb-4">
          <div className="col-12">
            <div className="card rounded-3 shadow-sm">
              <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
                <h4 className="m-0">All Deals</h4>
                <button className="btn btn-primary btn-sm">Add New Deal</button>
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
                    No deals found.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Title</th>
                          <th>Business</th>
                          <th>Discount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map(deal => (
                          <tr key={deal.id}>
                            <td className="fw-medium">{deal.title}</td>
                            <td>{deal.vendor?.business?.name || 'N/A'}</td>
                            <td><span className="badge bg-success">{deal.discount || '0'}% OFF</span></td>
                            <td>
                              <span className="badge bg-info">Active</span>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                              <button className="btn btn-sm btn-outline-danger">Delete</button>
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
