import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import GridLayout04 from "@/theme/listinghub/GridLayout04"
import { getBusinesses } from "@/lib/data/businesses"

export const dynamic = "force-dynamic"

/**
 * Explore page — grid listing. Puck-overridable.
 */
export default async function ExplorePage() {
  const data = await loadPagePuckData("explore")

  if (data) {
    return (
      <div className="puck-rendered-page">
        <Render config={config} data={data} />
      </div>
    )
  }

  const businesses = await getBusinesses()

  return <GridLayout04 businesses={businesses} />
}
