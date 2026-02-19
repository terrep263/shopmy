import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.brandingSettings.findFirst()
    
    // Create default settings if none exist
    if (!settings) {
      settings = await prisma.brandingSettings.create({
        data: {
          primary_color: '#c71f37',
          site_name: 'Shop My Neighborhood',
        },
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching branding settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branding settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { primary_color, logo_url, logo_light_url, site_name, favicon_url } = body
    
    // Get existing settings or create new
    let settings = await prisma.brandingSettings.findFirst()
    
    if (settings) {
      // Update existing
      settings = await prisma.brandingSettings.update({
        where: { id: settings.id },
        data: {
          primary_color,
          logo_url,
          logo_light_url,
          site_name,
          favicon_url,
        },
      })
    } else {
      // Create new
      settings = await prisma.brandingSettings.create({
        data: {
          primary_color,
          logo_url,
          logo_light_url,
          site_name,
          favicon_url,
        },
      })
    }
    
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error saving branding settings:', error)
    return NextResponse.json(
      { error: 'Failed to save branding settings' },
      { status: 500 }
    )
  }
}
