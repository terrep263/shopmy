import ClientOne, { type ReviewDataItem } from "@/components/theme/client-one"

export interface ReviewsSectionProps {
  title?: string
  subtitle?: string
  reviews?: ReviewDataItem[]
}

const DEFAULT_TITLE = "Our Great"
const DEFAULT_SUBTITLE = "Our clients love our services and give great & positive reviews"

export default function ReviewsSection({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  reviews,
}: ReviewsSectionProps) {
  return (
    <section className="bg-light">
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
            <div className="secHeading-wrap text-center">
              <h3 className="sectionHeading">
                {title} <span className="text-primary">Reviews</span>
              </h3>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>
        <ClientOne reviews={reviews} />
      </div>
    </section>
  )
}
