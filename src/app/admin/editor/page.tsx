"use client"

import { Puck, Data } from "@measured/puck"
import "@measured/puck/dist/index.css"
import { config } from "@/../puck/puck.config"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function PuckEditor() {
  const router = useRouter()
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load existing page data
    fetch("/api/puck/load")
      .then((res) => res.json())
      .then((loadedData) => {
        setData(loadedData)
        setLoading(false)
      })
      .catch(() => {
        // Use default if loading fails
        setData({
          content: [],
          root: {},
          zones: {},
        })
        setLoading(false)
      })
  }, [])

  const handlePublish = async (publishedData: Data) => {
    try {
      const response = await fetch("/api/puck/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(publishedData),
      })

      if (response.ok) {
        alert("✅ Page published successfully!")
        router.push("/")
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
      <Puck config={config} data={data!} onPublish={handlePublish} />
    </div>
  )
}
