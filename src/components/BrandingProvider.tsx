"use client"

import { useEffect } from 'react'

export default function BrandingProvider() {
  useEffect(() => {
    // Fetch branding settings and apply them
    const applyBranding = async () => {
      try {
        const response = await fetch('/api/admin/branding')
        const settings = await response.json()
        
        if (settings.primary_color) {
          const color = settings.primary_color
          const rgb = hexToRgb(color)
          
          // Apply primary color as CSS variables (Bootstrap 5)
          document.documentElement.style.setProperty('--bs-primary', color)
          document.documentElement.style.setProperty('--bs-primary-rgb', rgb)
          
          // Apply to button backgrounds and borders
          document.documentElement.style.setProperty('--bs-btn-bg', color)
          document.documentElement.style.setProperty('--bs-btn-border-color', color)
          document.documentElement.style.setProperty('--bs-btn-hover-bg', adjustBrightness(color, -10))
          document.documentElement.style.setProperty('--bs-btn-hover-border-color', adjustBrightness(color, -10))
          document.documentElement.style.setProperty('--bs-btn-active-bg', adjustBrightness(color, -15))
          document.documentElement.style.setProperty('--bs-btn-active-border-color', adjustBrightness(color, -15))
          
          // Apply to link colors
          document.documentElement.style.setProperty('--bs-link-color', color)
          document.documentElement.style.setProperty('--bs-link-hover-color', adjustBrightness(color, -15))
          
          // Inject global style for .btn-primary specifically
          let styleTag = document.getElementById('branding-styles')
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.id = 'branding-styles'
            document.head.appendChild(styleTag)
          }
          
          styleTag.textContent = `
            .btn-primary {
              background-color: ${color} !important;
              border-color: ${color} !important;
            }
            .btn-primary:hover {
              background-color: ${adjustBrightness(color, -10)} !important;
              border-color: ${adjustBrightness(color, -10)} !important;
            }
            .btn-primary:active,
            .btn-primary:focus {
              background-color: ${adjustBrightness(color, -15)} !important;
              border-color: ${adjustBrightness(color, -15)} !important;
            }
            .btn-outline-primary {
              color: ${color} !important;
              border-color: ${color} !important;
            }
            .btn-outline-primary:hover {
              background-color: ${color} !important;
              border-color: ${color} !important;
              color: #fff !important;
            }
            .badge.bg-primary {
              background-color: ${color} !important;
            }
            a {
              color: ${color};
            }
            a:hover {
              color: ${adjustBrightness(color, -15)};
            }
            .text-primary {
              color: ${color} !important;
            }
            .bg-primary {
              background-color: ${color} !important;
            }
            .border-primary {
              border-color: ${color} !important;
            }
          `
        }
        
        // Update logo sources if they exist
        if (settings.logo_url) {
          const logoElements = document.querySelectorAll('img[alt="Logo"], img[src*="logo"]')
          logoElements.forEach((img) => {
            if (img instanceof HTMLImageElement) {
              img.src = settings.logo_url
            }
          })
        }
        
        // Update page title if site name exists
        if (settings.site_name && document.title.includes('Shop My Neighborhood')) {
          document.title = document.title.replace('Shop My Neighborhood', settings.site_name)
        }
        
        // Update favicon if it exists
        if (settings.favicon_url) {
          const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
          if (faviconLink) {
            faviconLink.href = settings.favicon_url
          } else {
            // Create favicon link if it doesn't exist
            const link = document.createElement('link')
            link.rel = 'icon'
            link.href = settings.favicon_url
            document.head.appendChild(link)
          }
        }
      } catch (error) {
        console.error('Error loading branding:', error)
      }
    }
    
    applyBranding()
  }, [])
  
  return null // This component doesn't render anything
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '199, 31, 55' // Default red
  
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  
  return `${r}, ${g}, ${b}`
}

// Helper function to adjust brightness of a color
function adjustBrightness(hex: string, percent: number): string {
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
