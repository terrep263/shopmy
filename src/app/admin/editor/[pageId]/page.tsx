"use client"

import { Puck, Data } from "@measured/puck"
import "@measured/puck/dist/index.css"
import { config } from "@/../puck/puck.config"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getAdminFetchOpts, getAdminPostOpts } from "@/lib/adminFetch"

/**
 * Per-page Puck visual editor.
 *
 * Route: /admin/editor/[pageId]
 *
 * Loads page-specific Puck data and saves back to the per-page endpoint.
 * Falls back to an empty canvas when no override exists.
 */
export default function PagePuckEditor() {
  const router = useRouter()
  const params = useParams()
  const pageId = typeof params.pageId === "string" ? params.pageId : params.pageId?.[0] ?? ""

  const [data, setData] = useState<Data | null>(null)
  const [pageMeta, setPageMeta] = useState<{ label: string; route: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pageId) return

    // Load page-specific Puck data
    fetch(`/api/puck/pages/${pageId}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => {
        setData({ content: [], root: {}, zones: {} })
        setLoading(false)
      })

    // Load page metadata for the header
    fetch(`/api/admin/puck/pages`, getAdminFetchOpts())
      .then((r) => r.json())
      .then((pages: any[]) => {
        const page = pages.find((p: any) => p.pageId === pageId)
        if (page) setPageMeta({ label: page.label, route: page.route })
      })
      .catch(() => {})
  }, [pageId])

  const handlePublish = async (publishedData: Data) => {
    try {
      const response = await fetch(
        `/api/admin/puck/pages/${pageId}`,
        getAdminPostOpts(publishedData)
      )

      if (response.ok) {
        alert(`✅ "${pageMeta?.label || pageId}" published successfully!`)
        // Navigate to the live page
        const route = pageMeta?.route?.replace("[slug]", "test") ?? "/"
        router.push(route)
      } else {
        alert("❌ Failed to publish page")
      }
    } catch (error) {
      console.error("Publish error:", error)
      alert("❌ Error publishing page")
    }
  }

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading editor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="puck-editor-container">
      {pageMeta && (
        <div style={{
          background: "#1a1a2e",
          color: "#fff",
          padding: "8px 16px",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <strong>Editing:</strong> {pageMeta.label}
          <span style={{ opacity: 0.5 }}>({pageMeta.route})</span>
          <a href="/admin/editor" style={{ marginLeft: "auto", color: "#8ecae6", textDecoration: "none" }}>
            ← All Pages
          </a>
        </div>
      )}
      <Puck config={config} data={data!} onPublish={handlePublish} />
    </div>
  )
}
