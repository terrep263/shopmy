import PopularListingOne, { type ListDataItem } from "@/components/theme/popular-listing-one"

export interface TrendingListingsSectionProps {
  title?: string
  subtitle?: string
  listings?: ListDataItem[]
}

const DEFAULT_TITLE = "Trending & Popular"
const DEFAULT_SUBTITLE = "Explore Hot & Popular Business Listings"

export default function TrendingListingsSection({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  listings,
}: TrendingListingsSectionProps) {
  return (
    <section>
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
            <div className="secHeading-wrap text-center">
              <h3 className="sectionHeading">
                {title} <span className="text-primary">Listings</span>
              </h3>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>
        <PopularListingOne listings={listings} />
      </div>
    </section>
  )
}
