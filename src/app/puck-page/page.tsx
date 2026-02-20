import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData, loadPuckData } from "@/lib/puckStorage"

export const dynamic = "force-dynamic"

export default async function PuckPage() {
  /* Try multi-page storage first, then fall back to legacy single-page */
  const data = await loadPagePuckData("homepage") ?? await loadPuckData()

  return (
    <div className="puck-rendered-page">
      <Render config={config} data={data} />
    </div>
  )
}
