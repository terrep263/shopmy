import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'logo', 'logo-light', or 'favicon'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Determine file extension
    const ext = file.name.split('.').pop()
    const filename = `${type}.${ext}`
    
    // Save to public/assets
    const publicPath = path.join(process.cwd(), 'public', 'assets')
    
    try {
      await mkdir(publicPath, { recursive: true })
    } catch (err) {
      // Directory might already exist
    }
    
    const filepath = path.join(publicPath, filename)
    await writeFile(filepath, buffer)
    
    const url = `/assets/${filename}`
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
