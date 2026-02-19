/**
 * Category Manager Tool Page
 * 
 * Create and manage business categories
 */
'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Category {
  id: number
  name: string
  google_type: string
  active: boolean
  created_at: string
}

export default function CategoryManagerPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryGoogleType, setNewCategoryGoogleType] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories', {
        credentials: 'include'
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setCategories(data)
      }
    } catch (err) {
      setError('Failed to load categories')
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryGoogleType.trim()) {
      alert('Please enter both category name and Google type')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newCategoryName.trim(),
          googleType: newCategoryGoogleType.trim()
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create category')
      } else {
        setNewCategoryName('')
        setNewCategoryGoogleType('')
        loadCategories()
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (categoryId: number, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ categoryId, active: !currentActive })
      })

      if (res.ok) {
        loadCategories()
      }
    } catch (err) {
      alert('Failed to update category status')
    }
  }

  const commonGoogleTypes = [
    'restaurant',
    'cafe',
    'bar',
    'bakery',
    'gym',
    'spa',
    'hair_care',
    'beauty_salon',
    'clothing_store',
    'shoe_store',
    'electronics_store',
    'book_store',
    'hardware_store',
    'pharmacy',
    'supermarket',
    'convenience_store',
    'gas_station',
    'car_repair',
    'lawyer',
    'doctor',
    'dentist',
    'veterinary_care',
    'pet_store',
    'florist',
    'furniture_store',
    'home_goods_store'
  ]

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Category Manager</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Create New Category</h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., Restaurants"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Google Place Type</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., restaurant"
                      value={newCategoryGoogleType}
                      onChange={(e) => setNewCategoryGoogleType(e.target.value)}
                      disabled={loading}
                      list="google-types"
                    />
                    <datalist id="google-types">
                      {commonGoogleTypes.map(type => (
                        <option key={type} value={type} />
                      ))}
                    </datalist>
                    <small className="text-muted">Must match Google Places API type</small>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">&nbsp;</label>
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleCreateCategory}
                      disabled={loading || !newCategoryName.trim() || !newCategoryGoogleType.trim()}
                    >
                      {loading ? 'Creating...' : 'Create Category'}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">All Categories ({categories.length})</h5>
                
                {categories.length === 0 ? (
                  <p className="text-muted">No categories created yet. Create your first category above.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Category Name</th>
                          <th>Google Type</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category) => (
                          <tr key={category.id}>
                            <td>{category.id}</td>
                            <td><strong>{category.name}</strong></td>
                            <td><code>{category.google_type}</code></td>
                            <td>
                              <span className={`badge ${category.active ? 'bg-success' : 'bg-secondary'}`}>
                                {category.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>{new Date(category.created_at).toLocaleDateString()}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${category.active ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => handleToggleActive(category.id, category.active)}
                              >
                                {category.active ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title">About Categories</h5>
                <p>
                  Categories define the types of businesses that can be imported from Google Places. Each category 
                  must map to a valid Google Places API type.
                </p>
                <ul>
                  <li><strong>Active categories</strong> can be used for business imports</li>
                  <li><strong>Inactive categories</strong> cannot be selected for new imports</li>
                  <li>Google Place Types must match the official Google Places API types exactly</li>
                </ul>
                <p className="mb-0">
                  <a 
                    href="https://developers.google.com/maps/documentation/places/web-service/supported_types" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Google Place Types Documentation →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
