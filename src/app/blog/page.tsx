import { Render } from "@measured/puck"
import { config } from "@/../puck/puck.config"
import { loadPagePuckData } from "@/lib/puckStorage"
import BlogPage from "@/theme/listinghub/BlogPage"

export const dynamic = "force-dynamic"

/**
 * Blog page — ListingHub blog layout. Puck-overridable.
 */
export default async function Blog() {
  const data = await loadPagePuckData("blog")

  if (data) {
    return (
      <div className="puck-rendered-page">
        <Render config={config} data={data} />
      </div>
    )
  }

  return <BlogPage />
}
