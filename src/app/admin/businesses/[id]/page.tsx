"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import Link from "next/link"
import { getAdminFetchOpts } from "@/lib/adminFetch"

interface FilterOption {
  id: string
  name: string
}

export default function EditBusinessPage() {
  const router = useRouter()
  const params = useParams()
  const businessId = params.id as string

  const [business, setBusiness] = useState<Record<string, unknown> | null>(null)
  const [cities, setCities] = useState<FilterOption[]>([])
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    category: "",
    cityId: "",
    categoryId: "",
    national_phone_number: "",
    international_phone_number: "",
    website_uri: "",
    editorial_summary: "",
    is_verified: false,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/businesses/${businessId}`, getAdminFetchOpts()).then(
        (r) => {
          if (!r.ok) throw new Error("Failed to load business")
          return r.json()
        }
      ),
      fetch("/api/admin/cities", getAdminFetchOpts()).then((r) => r.json()),
      fetch("/api/admin/categories", getAdminFetchOpts()).then((r) =>
        r.json()
      ),
    ])
      .then(([data, c, cat]) => {
        setBusiness(data)
        setCities(Array.isArray(c) ? c : [])
        setCategories(Array.isArray(cat) ? cat : [])
        setFormData({
          name: data.name || "",
          address: data.address || "",
          city: data.city || "",
          category: data.category || "",
          cityId: data.cityId || "",
          categoryId: data.categoryId || "",
          national_phone_number: data.national_phone_number || "",
          international_phone_number: data.international_phone_number || "",
          website_uri: data.website_uri || "",
          editorial_summary: data.editorial_summary || "",
          is_verified: data.is_verified ?? false,
        })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [businessId])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccessMsg("")

    try {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        ...getAdminFetchOpts({ "Content-Type": "application/json" }),
        method: "PUT",
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to update business")
      }

      const updated = await res.json()
      setBusiness(updated)
      setSuccessMsg("Business updated successfully!")
      setTimeout(() => setSuccessMsg(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error && !business) {
    return (
      <AdminLayout>
        <div className="p-5">
          <div className="alert alert-danger">{error}</div>
          <Link href="/admin/businesses" className="btn btn-primary">
            Back to Businesses
          </Link>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="dashHeader p-xl-5 p-4 pb-xl-0 pb-0 pt-lg-0 pt-5">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="fw-medium mb-0">Edit Business</h2>
          <Link
            href="/admin/businesses"
            className="btn btn-outline-secondary btn-sm"
          >
            ← Back to List
          </Link>
        </div>
      </div>

      <div className="dashCaption p-xl-5 p-3 p-md-4">
        {successMsg && (
          <div className="alert alert-success py-2 mb-3">{successMsg}</div>
        )}
        {error && (
          <div className="alert alert-danger py-2 mb-3">{error}</div>
        )}

        <div className="row g-4">
          {/* Main form */}
          <div className="col-lg-8">
            <div className="card rounded-3 shadow-sm">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    {/* City dropdown */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">City</label>
                      <select
                        className="form-select"
                        name="cityId"
                        value={formData.cityId}
                        onChange={handleChange}
                      >
                        <option value="">— None —</option>
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">
                        Raw value: {formData.city || "—"}
                      </small>
                    </div>

                    {/* Category dropdown */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Category
                      </label>
                      <select
                        className="form-select"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange}
                      >
                        <option value="">— None —</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <small className="text-muted">
                        Raw value: {formData.category || "—"}
                      </small>
                    </div>
                  </div>

                  <div className="row">
                    {/* Phone */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="national_phone_number"
                        value={formData.national_phone_number}
                        onChange={handleChange}
                      />
                    </div>

                    {/* International Phone */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        Int&apos;l Phone
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="international_phone_number"
                        value={formData.international_phone_number}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      name="website_uri"
                      value={formData.website_uri}
                      onChange={handleChange}
                      placeholder="https://"
                    />
                  </div>

                  {/* Editorial Summary */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Editorial Summary
                    </label>
                    <textarea
                      className="form-control"
                      name="editorial_summary"
                      value={formData.editorial_summary}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  {/* Verified toggle */}
                  <div className="mb-4">
                    <div className="form-check form-switch">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="is_verified"
                        name="is_verified"
                        checked={formData.is_verified}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label fw-semibold"
                        htmlFor="is_verified"
                      >
                        Verified Business
                      </label>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>
                    <Link
                      href="/admin/businesses"
                      className="btn btn-secondary"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="col-lg-4">
            <div className="card rounded-3 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title mb-3">Business Info</h5>

                <div className="mb-3">
                  <small className="text-muted d-block">ID</small>
                  <code className="text-break small">{businessId}</code>
                </div>

                {business?.google_place_id && (
                  <div className="mb-3">
                    <small className="text-muted d-block">
                      Google Place ID
                    </small>
                    <code className="text-break small">
                      {String(business.google_place_id)}
                    </code>
                  </div>
                )}

                <div className="mb-3">
                  <small className="text-muted d-block">Claimed</small>
                  <span
                    className={`badge ${
                      business?.claimed ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {business?.claimed ? "Yes" : "No"}
                  </span>
                </div>

                {business?.rating != null && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Rating</small>
                    <span className="badge bg-warning text-dark">
                      ★ {Number(business.rating).toFixed(1)}
                    </span>
                    {business.user_rating_count != null && (
                      <small className="text-muted ms-1">
                        ({String(business.user_rating_count)} reviews)
                      </small>
                    )}
                  </div>
                )}

                <div className="mb-3">
                  <small className="text-muted d-block">Created</small>
                  <small>
                    {business?.created_at
                      ? new Date(
                          String(business.created_at)
                        ).toLocaleDateString()
                      : "N/A"}
                  </small>
                </div>

                {business?.updated_at && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Updated</small>
                    <small>
                      {new Date(
                        String(business.updated_at)
                      ).toLocaleDateString()}
                    </small>
                  </div>
                )}

                {business?.deleted_at && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Deleted</small>
                    <span className="badge bg-danger">
                      {new Date(
                        String(business.deleted_at)
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {business?.google_maps_uri && (
                  <div className="mb-3">
                    <a
                      href={String(business.google_maps_uri)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary w-100"
                    >
                      View on Google Maps ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Photo preview */}
            {business?.photo_references &&
              Array.isArray(business.photo_references) &&
              business.photo_references.length > 0 && (
                <div className="card rounded-3 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="card-title mb-3">Photos</h5>
                    <div className="row g-2">
                      {(business.photo_references as string[])
                        .slice(0, 4)
                        .map((src, i) => (
                          <div key={i} className="col-6">
                            <img
                              src={src}
                              alt={`Photo ${i + 1}`}
                              className="img-fluid rounded"
                              style={{
                                width: "100%",
                                height: 100,
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
