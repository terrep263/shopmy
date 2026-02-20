"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import Link from "next/link"
import { getAdminFetchOpts } from "@/lib/adminFetch"

interface BusinessRow {
  id: string
  name: string
  city: string
  category: string
  address: string
  rating: number | null
  national_phone_number: string | null
  is_verified: boolean | null
  claimed: boolean
  created_at: string
  deleted_at: string | null
  photo_references: string[] | null
  city_rel: { id: string; name: string } | null
  category_rel: { id: string; name: string } | null
}

interface FilterOption {
  id: string
  name: string
}

export default function AdminBusinessesPage() {
  const router = useRouter()

  // Data
  const [businesses, setBusinesses] = useState<BusinessRow[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [cities, setCities] = useState<FilterOption[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])

  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [backfilling, setBackfilling] = useState(false)
  const [backfillResult, setBackfillResult] = useState<string | null>(null)

  // Filters
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [cityId, setCityId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [claimed, setClaimed] = useState("")
  const [isVerified, setIsVerified] = useState("")
  const [includeDeleted, setIncludeDeleted] = useState(false)

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Debounce timer
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load filter options on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/cities", getAdminFetchOpts()).then((r) => r.json()),
      fetch("/api/admin/categories", getAdminFetchOpts()).then((r) => r.json()),
    ])
      .then(([c, cat]) => {
        setCities(Array.isArray(c) ? c : [])
        setCategories(Array.isArray(cat) ? cat : [])
      })
      .catch(() => {})
  }, [])

  // Fetch businesses
  const fetchBusinesses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "25")
      if (search) params.set("search", search)
      if (cityId) params.set("cityId", cityId)
      if (categoryId) params.set("categoryId", categoryId)
      if (claimed) params.set("claimed", claimed)
      if (isVerified) params.set("is_verified", isVerified)
      if (includeDeleted) params.set("includeDeleted", "true")

      const res = await fetch(
        `/api/admin/businesses?${params.toString()}`,
        getAdminFetchOpts()
      )
      if (!res.ok) throw new Error("Failed to load businesses")
      const result = await res.json()

      setBusinesses(result.data || [])
      setTotal(result.total || 0)
      setTotalPages(result.totalPages || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [page, search, cityId, categoryId, claimed, isVerified, includeDeleted])

  useEffect(() => {
    fetchBusinesses()
  }, [fetchBusinesses])

  // Debounced search
  const handleSearchChange = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(value)
      setPage(1)
      setSelected(new Set())
    }, 400)
  }

  // Filter change resets page
  const handleFilterChange = (
    setter: (v: string) => void,
    value: string
  ) => {
    setter(value)
    setPage(1)
    setSelected(new Set())
  }

  // Select all on current page
  const toggleSelectAll = () => {
    if (selected.size === businesses.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(businesses.map((b) => b.id)))
    }
  }

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Soft delete single
  const handleDelete = async (id: string) => {
    if (!confirm("Soft-delete this business? It can be restored later.")) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/businesses/${id}`, {
        ...getAdminFetchOpts({ "Content-Type": "application/json" }),
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete")
      await fetchBusinesses()
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed")
    } finally {
      setActionLoading(false)
    }
  }

  // Bulk actions
  const handleBulkAction = async (action: string) => {
    const ids = Array.from(selected)
    if (ids.length === 0) return

    const labels: Record<string, string> = {
      verify: "verify",
      unverify: "unverify",
      delete: "soft-delete",
      restore: "restore",
    }
    if (!confirm(`${labels[action] || action} ${ids.length} business(es)?`))
      return

    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/businesses/bulk", {
        ...getAdminFetchOpts({ "Content-Type": "application/json" }),
        method: "POST",
        body: JSON.stringify({ action, ids }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Bulk action failed")
      }
      setSelected(new Set())
      await fetchBusinesses()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Bulk action failed")
    } finally {
      setActionLoading(false)
    }
  }

  // Pagination helpers
  const pageNumbers = () => {
    const pages: number[] = []
    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  // Backfill photos for businesses missing images
  const handleBackfillPhotos = async () => {
    if (!confirm("Download photos from Google for businesses that don't have images yet?")) return
    setBackfilling(true)
    setBackfillResult(null)
    try {
      const res = await fetch("/api/admin/businesses/backfill-photos", {
        ...getAdminFetchOpts({ "Content-Type": "application/json" }),
        method: "POST",
        body: JSON.stringify({ limit: 50 }),
      })
      if (!res.ok) throw new Error("Backfill request failed")
      const data = await res.json()
      setBackfillResult(
        `Done! Processed: ${data.processed}, Updated: ${data.updated}, Skipped: ${data.skipped}, Failed: ${data.failed}`
      )
      await fetchBusinesses()
    } catch (err) {
      setBackfillResult(err instanceof Error ? err.message : "Backfill failed")
    } finally {
      setBackfilling(false)
    }
  }

  if (error && businesses.length === 0) {
    return (
      <AdminLayout>
        <div className="p-5">
          <div className="alert alert-danger">{error}</div>
          <Link href="/admin/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 pt-lg-0 pt-5">
        <h2 className="fw-medium mb-0">Manage Businesses</h2>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {/* Search & Filters */}
        <div className="card rounded-3 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              {/* Search */}
              <div className="col-lg-4 col-md-6">
                <label className="form-label small fw-semibold">Search</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name, address, city, Place ID…"
                  defaultValue={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>

              {/* City filter */}
              <div className="col-lg-2 col-md-3">
                <label className="form-label small fw-semibold">City</label>
                <select
                  className="form-select"
                  value={cityId}
                  onChange={(e) =>
                    handleFilterChange(setCityId, e.target.value)
                  }
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category filter */}
              <div className="col-lg-2 col-md-3">
                <label className="form-label small fw-semibold">Category</label>
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) =>
                    handleFilterChange(setCategoryId, e.target.value)
                  }
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Claimed filter */}
              <div className="col-lg-2 col-md-3">
                <label className="form-label small fw-semibold">Claimed</label>
                <select
                  className="form-select"
                  value={claimed}
                  onChange={(e) =>
                    handleFilterChange(setClaimed, e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="true">Claimed</option>
                  <option value="false">Unclaimed</option>
                </select>
              </div>

              {/* Verified filter */}
              <div className="col-lg-2 col-md-3">
                <label className="form-label small fw-semibold">Verified</label>
                <select
                  className="form-select"
                  value={isVerified}
                  onChange={(e) =>
                    handleFilterChange(setIsVerified, e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>
              </div>
            </div>

            {/* Include deleted toggle */}
            <div className="mt-3">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="includeDeleted"
                  checked={includeDeleted}
                  onChange={(e) => {
                    setIncludeDeleted(e.target.checked)
                    setPage(1)
                    setSelected(new Set())
                  }}
                />
                <label
                  className="form-check-label small"
                  htmlFor="includeDeleted"
                >
                  Include soft-deleted businesses
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selected.size > 0 && (
          <div className="alert alert-info d-flex align-items-center justify-content-between py-2 mb-4">
            <span className="fw-semibold">
              {selected.size} business(es) selected
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-success"
                disabled={actionLoading}
                onClick={() => handleBulkAction("verify")}
              >
                ✓ Verify
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={actionLoading}
                onClick={() => handleBulkAction("unverify")}
              >
                ✗ Unverify
              </button>
              <button
                className="btn btn-sm btn-danger"
                disabled={actionLoading}
                onClick={() => handleBulkAction("delete")}
              >
                🗑 Delete
              </button>
              {includeDeleted && (
                <button
                  className="btn btn-sm btn-warning"
                  disabled={actionLoading}
                  onClick={() => handleBulkAction("restore")}
                >
                  ↩ Restore
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="card rounded-3 shadow-sm">
          <div className="card-header py-3 px-4 d-flex justify-content-between align-items-center">
            <h4 className="m-0">
              Businesses{" "}
              <span className="badge bg-secondary ms-2 fw-normal">
                {total}
              </span>
            </h4>
            <button
              className="btn btn-sm btn-outline-success"
              disabled={backfilling}
              onClick={handleBackfillPhotos}
            >
              {backfilling ? "Downloading…" : "📷 Backfill Photos"}
            </button>
          </div>
          {backfillResult && (
            <div className="alert alert-info mb-0 rounded-0 py-2 px-4 small">
              {backfillResult}
              <button
                type="button"
                className="btn-close btn-close-sm float-end"
                onClick={() => setBackfillResult(null)}
              />
            </div>
          )}

          <div className="card-body p-0">
            {loading ? (
              <div className="p-4 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : businesses.length === 0 ? (
              <div className="p-4 text-center text-muted">
                No businesses found matching your filters.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={
                            businesses.length > 0 &&
                            selected.size === businesses.length
                          }
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>Name</th>
                      <th className="text-center" style={{ width: 60 }}>📷</th>
                      <th>City</th>
                      <th>Category</th>
                      <th className="text-center">Rating</th>
                      <th>Phone</th>
                      <th className="text-center">Verified</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map((b) => (
                      <tr
                        key={b.id}
                        className={b.deleted_at ? "table-danger" : ""}
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selected.has(b.id)}
                            onChange={() => toggleSelect(b.id)}
                          />
                        </td>
                        <td>
                          <span className="fw-medium">{b.name}</span>
                          {b.deleted_at && (
                            <span className="badge bg-danger ms-2 small">
                              Deleted
                            </span>
                          )}
                        </td>
                        <td className="text-center">
                          {b.photo_references && b.photo_references.length > 0 ? (
                            <span className="badge bg-success" title={`${b.photo_references.length} photo(s)`}>
                              🖼 {b.photo_references.length}
                            </span>
                          ) : (
                            <span className="badge bg-light text-muted" title="No photos">—</span>
                          )}
                        </td>
                        <td>
                          {b.city_rel?.name || b.city || "N/A"}
                        </td>
                        <td>
                          {b.category_rel?.name || b.category || "N/A"}
                        </td>
                        <td className="text-center">
                          {b.rating != null ? (
                            <span className="badge bg-warning text-dark">
                              ★ {Number(b.rating).toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          {b.national_phone_number || "N/A"}
                        </td>
                        <td className="text-center">
                          {b.is_verified ? (
                            <span className="badge bg-success">✓</span>
                          ) : (
                            <span className="badge bg-light text-muted">
                              ✗
                            </span>
                          )}
                        </td>
                        <td>
                          <small>
                            {new Date(b.created_at).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                router.push(`/admin/businesses/${b.id}`)
                              }
                            >
                              Edit
                            </button>
                            {!b.deleted_at && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                disabled={actionLoading}
                                onClick={() => handleDelete(b.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer d-flex justify-content-between align-items-center py-3 px-4">
              <small className="text-muted">
                Showing {(page - 1) * 25 + 1}–
                {Math.min(page * 25, total)} of {total}
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${page === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        setPage(page - 1)
                        setSelected(new Set())
                      }}
                    >
                      ‹ Prev
                    </button>
                  </li>
                  {pageNumbers().map((p) => (
                    <li
                      key={p}
                      className={`page-item ${p === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          setPage(p)
                          setSelected(new Set())
                        }}
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      page === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        setPage(page + 1)
                        setSelected(new Set())
                      }}
                    >
                      Next ›
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
