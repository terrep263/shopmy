import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import ListLayout02 from "@/theme/listinghub/ListLayout02"
import { getBusinesses } from "@/lib/data/businesses"

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

  const businesses = await getBusinesses()

  return <ListLayout02 businesses={businesses} />
}
