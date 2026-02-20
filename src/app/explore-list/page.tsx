import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import ListLayout02 from "@/theme/listinghub/ListLayout02"

export const dynamic = "force-dynamic"

/**
 * Explore List page — list layout. Puck-overridable.
 */
export default async function ExploreListPage() {
  const data = await loadPagePuckData("exploreList")

  if (data) {
    return (
      <div className="puck-rendered-page">
        <Render config={config} data={data} />
      </div>
    )
  }

  return <ListLayout02 />
}
