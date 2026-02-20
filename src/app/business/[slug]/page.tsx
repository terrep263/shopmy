import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import SingleListing04 from "@/theme/listinghub/SingleListing04"
import { getBusinessById } from "@/lib/data/businesses"

export const dynamic = "force-dynamic"

/**
 * Business detail page — single listing. Puck-overridable.
 * Loads real business data from DB by ID.
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

  /* Load business from database using slug as the business ID */
  const business = await getBusinessById(slug)

  if (!business) {
    return (
      <div className="container py-5 text-center">
        <h2>Business Not Found</h2>
        <p className="text-muted">The business you are looking for does not exist.</p>
      </div>
    )
  }

  return <SingleListing04 business={business} />
}
