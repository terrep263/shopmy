/**
 * Admin Logs Tool Page
 * 
 * View platform admin action logs
 */
'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface AdminLog {
  id: number
  action_type: string
  entity_type: string
  entity_id: number | null
  metadata: any
  created_at: string
  admin?: {
    email: string
  }
}

interface LogResponse {
  items: AdminLog[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLogs()
  }, [page])

  const loadLogs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/admin/logs?page=${page}&pageSize=20`, {
        credentials: 'include'
      })
      
      const data: LogResponse = await res.json()
      
      if (data?.items) {
        setLogs(data.items)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      setError('Failed to load logs')
    } finally {
      setLoading(false)
    }
  }

  const getActionBadgeClass = (actionType: string) => {
    switch (actionType) {
      case 'IMPORT_CITY':
        return 'bg-info'
      case 'GENERATE_DEAL':
        return 'bg-success'
      case 'CREATE_CITY':
      case 'CREATE_CATEGORY':
        return 'bg-primary'
      case 'UPDATE_VENDOR':
        return 'bg-warning'
      default:
        return 'bg-secondary'
    }
  }

  const formatMetadata = (metadata: any) => {
    if (!metadata) return null
    
    try {
      const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata
      return (
        <details className="small">
          <summary className="cursor-pointer">View Details</summary>
          <pre className="mt-2 p-2 bg-light rounded" style={{ fontSize: '0.75rem' }}>
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </details>
      )
    } catch {
      return <span className="text-muted">Invalid metadata</span>
    }
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Admin Logs</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-0">Platform Admin Actions ({total})</h5>
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
            ) : logs.length === 0 ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <p className="text-muted mb-0">No admin actions logged yet.</p>
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
                            <th>Timestamp</th>
                            <th>Admin</th>
                            <th>Action</th>
                            <th>Entity</th>
                            <th>Entity ID</th>
                            <th>Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map((log) => (
                            <tr key={log.id}>
                              <td>{log.id}</td>
                              <td className="small">
                                {new Date(log.created_at).toLocaleString()}
                              </td>
                              <td>{log.admin?.email || 'Unknown'}</td>
                              <td>
                                <span className={`badge ${getActionBadgeClass(log.action_type)}`}>
                                  {log.action_type.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td>{log.entity_type || '-'}</td>
                              <td>{log.entity_id || '-'}</td>
                              <td>
                                {formatMetadata(log.metadata)}
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
                <h5 className="card-title">About Admin Logs</h5>
                <p>
                  Admin logs track all actions performed by platform administrators. This provides an audit trail 
                  for compliance and troubleshooting.
                </p>
                <h6>Logged Action Types:</h6>
                <ul>
                  <li><span className="badge bg-info">IMPORT_CITY</span> - Business imports from Google Places</li>
                  <li><span className="badge bg-success">GENERATE_DEAL</span> - Admin-generated deals</li>
                  <li><span className="badge bg-primary">CREATE_CITY</span> - New city created</li>
                  <li><span className="badge bg-primary">CREATE_CATEGORY</span> - New category created</li>
                  <li><span className="badge bg-warning">UPDATE_VENDOR</span> - Vendor status changes</li>
                </ul>
                <p className="mb-0">
                  <strong>Note:</strong> Logs are automatically created and cannot be deleted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
