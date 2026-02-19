import { savePuckData } from "@/lib/puckStorage"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    await savePuckData(data)
    
    return NextResponse.json({ success: true, message: "Page data saved successfully" })
  } catch (error) {
    console.error("Error saving Puck data:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save page data" },
      { status: 500 }
    )
  }
}
