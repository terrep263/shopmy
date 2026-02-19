"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface BrandingSettings {
  id: string
  primary_color: string
  logo_url: string | null
  logo_light_url: string | null
  site_name: string
  favicon_url: string | null
}

export default function BrandingPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<BrandingSettings | null>(null)
  const [primaryColor, setPrimaryColor] = useState('#c71f37')
  const [siteName, setSiteName] = useState('Shop My Neighborhood')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoLightUrl, setLogoLightUrl] = useState('')
  const [faviconUrl, setFaviconUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingLogoLight, setUploadingLogoLight] = useState(false)
  const [uploadingFavicon, setUploadingFavicon] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/branding')
      const data = await response.json()
      setSettings(data)
      setPrimaryColor(data.primary_color)
      setSiteName(data.site_name)
      setLogoUrl(data.logo_url || '')
      setLogoLightUrl(data.logo_light_url || '')
      setFaviconUrl(data.favicon_url || '')
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, type: 'logo' | 'logo-light' | 'favicon') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    if (type === 'logo') setUploadingLogo(true)
    if (type === 'logo-light') setUploadingLogoLight(true)
    if (type === 'favicon') setUploadingFavicon(true)

    try {
      const response = await fetch('/api/admin/branding/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      
      if (type === 'logo') setLogoUrl(data.url)
      if (type === 'logo-light') setLogoLightUrl(data.url)
      if (type === 'favicon') setFaviconUrl(data.url)
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    } finally {
      if (type === 'logo') setUploadingLogo(false)
      if (type === 'logo-light') setUploadingLogoLight(false)
      if (type === 'favicon') setUploadingFavicon(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_color: primaryColor,
          logo_url: logoUrl || null,
          logo_light_url: logoLightUrl || null,
          site_name: siteName,
          favicon_url: faviconUrl || null,
        }),
      })
      
      if (response.ok) {
        alert('Branding settings saved successfully!')
        
        // Apply colors immediately with !important styles
        const styleTag = document.getElementById('branding-styles') || document.createElement('style')
        styleTag.id = 'branding-styles'
        if (!document.getElementById('branding-styles')) {
          document.head.appendChild(styleTag)
        }
        
        styleTag.textContent = `
          .btn-primary {
            background-color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }
          .btn-primary:hover {
            background-color: ${adjustBrightness(primaryColor, -10)} !important;
            border-color: ${adjustBrightness(primaryColor, -10)} !important;
          }
          .btn-outline-primary {
            color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }
          .btn-outline-primary:hover {
            background-color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }
          a { color: ${primaryColor}; }
          .badge.bg-primary { background-color: ${primaryColor} !important; }
          .text-primary { color: ${primaryColor} !important; }
          .bg-primary { background-color: ${primaryColor} !important; }
        `
        
        // Reload to apply changes everywhere
        setTimeout(() => router.refresh(), 500)
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }
  
  // Helper function to adjust brightness
  const adjustBrightness = (hex: string, percent: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return hex
    
    let r = parseInt(result[1], 16)
    let g = parseInt(result[2], 16)
    let b = parseInt(result[3], 16)
    
    r = Math.max(0, Math.min(255, r + (r * percent / 100)))
    g = Math.max(0, Math.min(255, g + (g * percent / 100)))
    b = Math.max(0, Math.min(255, b + (b * percent / 100)))
    
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">🎨 Branding Manager</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="row">
        {/* Left Column - Settings */}
        <div className="col-lg-8">
          {/* Primary Color */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Primary Brand Color</h5>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <label className="form-label">Color Picker</label>
                  <input
                    type="color"
                    className="form-control form-control-color w-100"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    style={{ height: '60px' }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Hex Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#c71f37"
                  />
                  <small className="text-muted">
                    This color will be used for buttons, links, and highlights
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Site Name */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Site Name</h5>
            </div>
            <div className="card-body">
              <input
                type="text"
                className="form-control"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Shop My Neighborhood"
              />
              <small className="text-muted">
                This name appears in the navigation and page titles
              </small>
            </div>
          </div>

          {/* Main Logo */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Main Logo</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                {logoUrl && (
                  <div className="mb-3 p-3 bg-light rounded text-center">
                    <img src={logoUrl} alt="Logo" style={{ maxHeight: '100px' }} />
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'logo')
                  }}
                  disabled={uploadingLogo}
                />
                <small className="text-muted">
                  PNG or SVG recommended. Used on light backgrounds.
                  {uploadingLogo && <span className="text-primary"> Uploading...</span>}
                </small>
              </div>
            </div>
          </div>

          {/* Light Logo (for dark backgrounds) */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Light Logo (Optional)</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                {logoLightUrl && (
                  <div className="mb-3 p-3 bg-dark rounded text-center">
                    <img src={logoLightUrl} alt="Light Logo" style={{ maxHeight: '100px' }} />
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'logo-light')
                  }}
                  disabled={uploadingLogoLight}
                />
                <small className="text-muted">
                  White/light version of your logo for dark backgrounds.
                  {uploadingLogoLight && <span className="text-primary"> Uploading...</span>}
                </small>
              </div>
            </div>
          </div>

          {/* Favicon */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Favicon (Optional)</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                {faviconUrl && (
                  <div className="mb-3">
                    <img src={faviconUrl} alt="Favicon" style={{ width: '32px', height: '32px' }} />
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, 'favicon')
                  }}
                  disabled={uploadingFavicon}
                />
                <small className="text-muted">
                  32x32px icon for browser tabs. ICO or PNG format.
                  {uploadingFavicon && <span className="text-primary"> Uploading...</span>}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="col-lg-4">
          <div className="card position-sticky" style={{ top: '20px' }}>
            <div className="card-header">
              <h5 className="mb-0">Live Preview</h5>
            </div>
            <div className="card-body">
              <h6 className="mb-3">Buttons</h6>
              <div className="d-flex gap-2 flex-wrap mb-4">
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
                >
                  Primary Button
                </button>
                <button
                  className="btn btn-outline-primary"
                  style={{ color: primaryColor, borderColor: primaryColor }}
                >
                  Outline
                </button>
              </div>

              <h6 className="mb-3">Links</h6>
              <div className="mb-4">
                <a href="#" style={{ color: primaryColor }}>
                  This is a link with your brand color
                </a>
              </div>

              <h6 className="mb-3">Badge</h6>
              <div className="mb-4">
                <span
                  className="badge"
                  style={{ backgroundColor: primaryColor }}
                >
                  Featured
                </span>
              </div>

              <h6 className="mb-3">Site Name</h6>
              <div className="mb-4">
                <div className="fw-bold" style={{ color: primaryColor }}>
                  {siteName}
                </div>
              </div>

              {logoUrl && (
                <>
                  <h6 className="mb-3">Logo Preview</h6>
                  <div className="p-3 bg-light rounded text-center">
                    <img src={logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '80px' }} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
