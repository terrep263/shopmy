import { loadPuckData } from "@/lib/puckStorage"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await loadPuckData()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error loading Puck data:", error)
    return NextResponse.json(
      { error: "Failed to load page data" },
      { status: 500 }
    )
  }
}
