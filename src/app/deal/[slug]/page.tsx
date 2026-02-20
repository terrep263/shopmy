import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import SingleListing04 from "@/theme/listinghub/SingleListing04"

export const dynamic = "force-dynamic"

/**
 * Deal detail page — single listing layout. Puck-overridable.
 */
export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await loadPagePuckData("deal")

  if (data) {
    return (
      <div className="puck-rendered-page">
        <Render config={config} data={data} />
      </div>
    )
  }

  return <SingleListing04 />
}
