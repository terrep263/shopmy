/**
 * DealGuard Studio Tool Page
 * 
 * AI-powered deal generation and validation
 */
'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Vendor {
  id: number
  business?: {
    name: string
  }
  user?: {
    email: string
  }
  status: string
}

interface DealResult {
  id: number
  title: string
  price: number
  original_value: number
  savings: number
  discount_percentage: string
  deal_guard_score: number
  published: boolean
}

export default function DealGuardStudioPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [selectedVendorId, setSelectedVendorId] = useState('')
  const [price, setPrice] = useState('')
  const [originalValue, setOriginalValue] = useState('')
  const [expirationDays, setExpirationDays] = useState('30')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DealResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const opts = { credentials: "include" as RequestCredentials }
    
    fetch("/api/admin/vendors", opts)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVendors(data.filter((v: Vendor) => v.status === 'APPROVED'))
        }
      })
      .catch(() => setError("Failed to load vendors"))
  }, [])

  const handleGenerateDeal = async () => {
    if (!selectedVendorId || !price || !originalValue || !expirationDays) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await fetch('/api/admin/deals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          vendorId: parseInt(selectedVendorId),
          price: parseFloat(price),
          originalValue: parseFloat(originalValue),
          expirationDays: parseInt(expirationDays)
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Deal generation failed')
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
              <h2>DealGuard Studio</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-4">Generate AI-Validated Deal</h5>
                
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Select Vendor</label>
                    <select
                      className="form-select"
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                      disabled={loading}
                    >
                      <option value="">-- Select Vendor --</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.business?.name || vendor.user?.email || `Vendor #${vendor.id}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Expiration Days</label>
                    <input
                      type="number"
                      className="form-control"
                      value={expirationDays}
                      onChange={(e) => setExpirationDays(e.target.value)}
                      min="1"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Deal Price ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      step="0.01"
                      min="0"
                      placeholder="e.g., 49.99"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Original Value ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                      step="0.01"
                      min="0"
                      placeholder="e.g., 100.00"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-12">
                    <button
                      className="btn btn-primary"
                      onClick={handleGenerateDeal}
                      disabled={loading || !selectedVendorId || !price || !originalValue}
                    >
                      {loading ? 'Generating...' : 'Generate Deal'}
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
                    <h6>Deal Generated Successfully!</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="mb-0">
                          <li><strong>Title:</strong> {result.title}</li>
                          <li><strong>Price:</strong> ${result.price}</li>
                          <li><strong>Original Value:</strong> ${result.original_value}</li>
                          <li><strong>Savings:</strong> ${result.savings}</li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="mb-0">
                          <li><strong>Discount:</strong> {result.discount_percentage}% off</li>
                          <li><strong>DealGuard Score:</strong> {result.deal_guard_score}/100</li>
                          <li><strong>Status:</strong> {result.published ? 'Published' : 'Draft'}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title">About DealGuard Studio</h5>
                <p>
                  DealGuard Studio allows platform admins to generate deals on behalf of vendors. 
                  Each deal is automatically validated by our AI DealGuard system to ensure quality and authenticity.
                </p>
                <h6>DealGuard Scoring System:</h6>
                <ul>
                  <li><strong>Score ≥ 50:</strong> Deal is automatically published</li>
                  <li><strong>Score &lt; 50:</strong> Deal is saved as draft for manual review</li>
                  <li><strong>Factors analyzed:</strong> Discount percentage, price reasonableness, title quality, and more</li>
                </ul>
                <p className="text-muted mb-0">
                  <strong>Note:</strong> Admin-generated deals bypass vendor subscription restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
