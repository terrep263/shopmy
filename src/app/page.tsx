import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPuckData } from "@/lib/puckStorage"

export const dynamic = "force-dynamic"

/**
 * Homepage - Now powered by Puck visual editor
 * Edit at /admin/editor and changes will appear here
 */
export default async function Home() {
  const data = await loadPuckData()

  return (
    <div className="puck-rendered-page">
      <Render config={config} data={data} />
    </div>
  )
}
