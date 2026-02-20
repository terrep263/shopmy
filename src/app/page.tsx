import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import HomePage from "@/theme/listinghub/HomePage"
import { getBusinesses } from "@/lib/data/businesses"
import { getCategories } from "@/lib/data/categories"

export const dynamic = "force-dynamic"

/**
 * Homepage — renders Puck data if customised, otherwise ListingHub theme.
 * Edit at /admin/editor/homepage
 */
export default async function Home() {
  const data = await loadPagePuckData("homepage")

  /* If the admin has published Puck content for this page, render it */
  if (data) {
    return (
      <div className="puck-rendered-page">
        <Render config={config} data={data} />
      </div>
    )
  }

  /* Fetch live data for the theme page */
  const [businesses, categories] = await Promise.all([
    getBusinesses(),
    getCategories(),
  ])

  /* Otherwise render the ListingHub theme page */
  return <HomePage businesses={businesses} categories={categories} />
}
