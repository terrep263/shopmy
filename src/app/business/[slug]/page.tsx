import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import SingleListing04 from "@/theme/listinghub/SingleListing04"

export const dynamic = "force-dynamic"

/**
 * Business detail page — single listing. Puck-overridable.
 * In future, pass slug to load real business data.
 */
export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await loadPagePuckData("business")

  if (data) {
    return (
      <div className="puck-rendered-page">
        <Render config={config} data={data} />
      </div>
    )
  }

  return <SingleListing04 />
}
