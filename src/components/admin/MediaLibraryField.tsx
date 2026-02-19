"use client"

import React, { useRef, useState } from "react"
import Image from "next/image"
import MediaLibraryModal from "./MediaLibraryModal"

interface MediaLibraryFieldProps {
  value?: string
  onChange: (value: string) => void
  label?: string
}

export default function MediaLibraryField({ value, onChange, label }: MediaLibraryFieldProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed")
      }

      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="media-library-field d-flex flex-column gap-2">
      {label && <label className="form-label fw-semibold mb-1">{label}</label>}

      <div
        className="border rounded bg-light d-flex align-items-center justify-content-center"
        style={{ minHeight: "160px", overflow: "hidden", position: "relative" }}
      >
        {value ? (
          <Image
            src={value}
            alt="Selected"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span className="text-muted">No image selected</span>
        )}
      </div>

      {error && <div className="text-danger small">{error}</div>}

      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setModalOpen(true)}>
          Browse
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleUploadClick}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <MediaLibraryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(url) => onChange(url)}
      />
    </div>
  )
}
