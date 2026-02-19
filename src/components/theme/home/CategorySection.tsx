import CategoryOne, { type CategoryDataItem } from "@/components/theme/categories/category-one"

export interface CategorySectionProps {
  title?: string
  subtitle?: string
  categories?: CategoryDataItem[]
}

const DEFAULT_TITLE = "Hot & Trending"
const DEFAULT_SUBTITLE = "Explore all types of popular category for submit your listings"

export default function CategorySection({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  categories,
}: CategorySectionProps) {
  return (
    <section className="pb-0" id="mains">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
            <div className="secHeading-wrap text-center">
              <h3 className="sectionHeading">
                {title} <span className="text-primary">Categories</span>
              </h3>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>
        <CategoryOne categories={categories} />
      </div>
    </section>
  )
}
