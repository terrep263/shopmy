"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

interface MediaLibraryModalProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}

export default function MediaLibraryModal({ open, onClose, onSelect }: MediaLibraryModalProps) {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    let isMounted = true
    queueMicrotask(() => {
      if (!isMounted) return
      setLoading(true)
      setError(null)
    })

    fetch("/api/admin/media/list", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        const list = Array.isArray(data) ? data : data.files
        setFiles(Array.isArray(list) ? list : [])
      })
      .catch((err) => {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : "Failed to load uploads")
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="media-library-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.55)",
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        className="media-library-modal bg-white rounded shadow"
        style={{
          width: "min(1000px, 100%)",
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">
          <h5 className="mb-0">Media Library</h5>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="p-4" style={{ overflowY: "auto" }}>
          {loading && <div className="text-muted">Loading uploads...</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && files.length === 0 && (
            <div className="text-muted">No uploads yet. Use Upload to add images.</div>
          )}

          {!loading && files.length > 0 && (
            <div
              className="media-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "1rem",
              }}
            >
              {files.map((url) => (
                <button
                  key={url}
                  type="button"
                  className="border rounded overflow-hidden p-0 bg-white"
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    position: "relative",
                  }}
                  onClick={() => {
                    onSelect(url)
                    onClose()
                  }}
                >
                  <Image
                    src={url}
                    alt="Uploaded file"
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
