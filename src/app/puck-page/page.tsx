import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPuckData } from "@/lib/puckStorage"

export const dynamic = "force-dynamic"

export default async function PuckPage() {
  const data = await loadPuckData()

  return (
    <div className="puck-rendered-page">
      <Render config={config} data={data} />
    </div>
  )
}
