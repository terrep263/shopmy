"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAdminFetchOpts } from "@/lib/adminFetch"

interface PageEntry {
  pageId: string
  label: string
  route: string
  description?: string
  hasOverride: boolean
}

/**
 * Puck Editor Page Picker — lists all registered pages so the admin
 * can choose which page to visually edit.
 */
export default function PuckEditorIndex() {
  const [pages, setPages] = useState<PageEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/puck/pages", getAdminFetchOpts())
      .then((r) => r.json())
      .then((data) => {
        setPages(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold mb-0">🎨 Visual Page Editor</h2>
        <Link href="/admin/dashboard" className="btn btn-outline-secondary btn-sm">
          ← Back to Dashboard
        </Link>
      </div>
      <p className="text-muted mb-4">
        Choose a page to customise with the drag-and-drop Puck editor.
        Pages without overrides render the ListingHub theme by default.
      </p>

      <div className="row g-3">
        {pages.map((page) => (
          <div className="col-xl-4 col-lg-6 col-md-6" key={page.pageId}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <h5 className="card-title fw-semibold mb-0">{page.label}</h5>
                  {page.hasOverride ? (
                    <span className="badge bg-success rounded-pill">Customised</span>
                  ) : (
                    <span className="badge bg-secondary rounded-pill">Theme Default</span>
                  )}
                </div>
                <p className="card-text text-muted small flex-grow-1">
                  {page.description || page.route}
                </p>
                <code className="d-block text-muted small mb-3">{page.route}</code>
                <div className="d-flex gap-2 mt-auto">
                  <Link
                    href={`/admin/editor/${page.pageId}`}
                    className="btn btn-primary btn-sm flex-grow-1"
                  >
                    ✏️ Edit Page
                  </Link>
                  <Link
                    href={page.route.replace("[slug]", "test")}
                    className="btn btn-outline-primary btn-sm"
                    target="_blank"
                  >
                    👁 Preview
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
