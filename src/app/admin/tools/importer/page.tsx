/**
 * Business Importer Tool Page
 * 
 * Import businesses from Google Places by city and category
 */
'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface City {
  id: number
  name: string
  active: boolean
}

interface Category {
  id: number
  name: string
  google_type: string
  active: boolean
}

interface ImportResult {
  totalFetched: number
  created: number
  skipped: number
}

export default function ImporterToolPage() {
  const [cities, setCities] = useState<City[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCityId, setSelectedCityId] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const opts = { credentials: "include" as RequestCredentials }
    
    Promise.all([
      fetch("/api/admin/cities", opts).then(res => res.json()),
      fetch("/api/admin/categories", opts).then(res => res.json())
    ])
    .then(([citiesRes, categoriesRes]) => {
      if (Array.isArray(citiesRes)) setCities(citiesRes.filter(c => c.active))
      if (Array.isArray(categoriesRes)) setCategories(categoriesRes.filter(c => c.active))
    })
    .catch(() => setError("Failed to load cities and categories"))
  }, [])

  const handleImport = async () => {
    if (!selectedCityId || !selectedCategoryId) {
      alert('Please select both city and category')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/admin/import-city', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          cityId: parseInt(selectedCityId),
          categoryId: parseInt(selectedCategoryId)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Import failed')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Business Importer</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Import Businesses from Google Places</h5>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Select City</label>
                    <select
                      className="form-select"
                      value={selectedCityId}
                      onChange={(e) => setSelectedCityId(e.target.value)}
                      disabled={loading}
                    >
                      <option value="">-- Select City --</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Select Category</label>
                    <select
                      className="form-select"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      disabled={loading}
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.google_type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-primary"
                      onClick={handleImport}
                      disabled={loading || !selectedCityId || !selectedCategoryId}
                    >
                      {loading ? 'Importing...' : 'Start Import'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}

                {result && (
                  <div className="alert alert-success mt-3" role="alert">
                    <h6>Import Complete!</h6>
                    <ul className="mb-0">
                      <li>Total Fetched: {result.totalFetched}</li>
                      <li>Created: {result.created}</li>
                      <li>Skipped (duplicates): {result.skipped}</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title">How It Works</h5>
                <ol>
                  <li>Select a city from the dropdown (cities must be created first in City Manager)</li>
                  <li>Select a business category (categories must be created first in Category Manager)</li>
                  <li>Click &ldquo;Start Import&rdquo; to fetch businesses from Google Places API</li>
                  <li>The system will fetch up to 60 businesses (3 pages of 20 results each)</li>
                  <li>Duplicate businesses (by Google Place ID) will be automatically skipped</li>
                </ol>
                <p className="text-muted mb-0">
                  <strong>Note:</strong> Imports are rate-limited with a 2-second delay between API pages to comply with Google&apos;s usage policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
