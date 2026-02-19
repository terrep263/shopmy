/**
 * City Manager Tool Page
 * 
 * Create and manage cities for business imports
 */
'use client'
import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface City {
  id: number
  name: string
  active: boolean
  last_imported_at: string | null
  created_at: string
}

export default function CityManagerPage() {
  const [cities, setCities] = useState<City[]>([])
  const [newCityName, setNewCityName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCities()
  }, [])

  const loadCities = async () => {
    try {
      const res = await fetch('/api/admin/cities', {
        credentials: 'include'
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setCities(data)
      }
    } catch (err) {
      setError('Failed to load cities')
    }
  }

  const handleCreateCity = async () => {
    if (!newCityName.trim()) {
      alert('Please enter a city name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newCityName.trim() })
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create city')
      } else {
        setNewCityName('')
        loadCities()
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (cityId: number, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/cities', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cityId, active: !currentActive })
      })

      if (res.ok) {
        loadCities()
      }
    } catch (err) {
      alert('Failed to update city status')
    }
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>City Manager</h2>
              <a href="/admin/dashboard" className="btn btn-secondary">
                ← Back to Dashboard
              </a>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Create New City</h5>
                <div className="row g-3">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter city name (e.g., Chicago, IL)"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4">
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleCreateCity}
                      disabled={loading || !newCityName.trim()}
                    >
                      {loading ? 'Creating...' : 'Create City'}
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
                <h5 className="card-title mb-3">All Cities ({cities.length})</h5>
                
                {cities.length === 0 ? (
                  <p className="text-muted">No cities created yet. Create your first city above.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>City Name</th>
                          <th>Status</th>
                          <th>Last Import</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cities.map((city) => (
                          <tr key={city.id}>
                            <td>{city.id}</td>
                            <td><strong>{city.name}</strong></td>
                            <td>
                              <span className={`badge ${city.active ? 'bg-success' : 'bg-secondary'}`}>
                                {city.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              {city.last_imported_at 
                                ? new Date(city.last_imported_at).toLocaleString()
                                : 'Never'
                              }
                            </td>
                            <td>{new Date(city.created_at).toLocaleDateString()}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${city.active ? 'btn-warning' : 'btn-success'}`}
                                onClick={() => handleToggleActive(city.id, city.active)}
                              >
                                {city.active ? 'Deactivate' : 'Activate'}
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
                <h5 className="card-title">About Cities</h5>
                <p>
                  Cities are used to organize business imports from Google Places. Each city can have multiple 
                  business categories imported from Google.
                </p>
                <ul>
                  <li><strong>Active cities</strong> can be used for business imports</li>
                  <li><strong>Inactive cities</strong> cannot be selected for new imports</li>
                  <li>Last Import timestamp shows when businesses were last imported for this city</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
