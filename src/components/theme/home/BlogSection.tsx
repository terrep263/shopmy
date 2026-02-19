import BlogOne, { type BlogDataItem } from "@/components/theme/blog-one"

export interface BlogSectionProps {
  title?: string
  subtitle?: string
  posts?: BlogDataItem[]
}

const DEFAULT_TITLE = "Latest Updates"
const DEFAULT_SUBTITLE = "Get the latest updates about listings and your neighborhood"

export default function BlogSection({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  posts,
}: BlogSectionProps) {
  return (
    <section>
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-11 col-sm-12">
            <div className="secHeading-wrap text-center">
              <h3 className="sectionHeading">
                {title} <span className="text-primary">News</span>
              </h3>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>
        <BlogOne posts={posts} />
      </div>
    </section>
  )
}
