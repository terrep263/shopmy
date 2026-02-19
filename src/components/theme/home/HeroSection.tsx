import Link from "next/link"
import { BsMouse } from "react-icons/bs"
import type { CategoryPill } from "./types"

export interface HeroSectionProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  categoryPills?: CategoryPill[]
  children?: React.ReactNode
}

const DEFAULT_TITLE = "Your Neighborhood Marketplace"
const DEFAULT_SUBTITLE = "Discover deals. Support local businesses. Strengthen your community."
const DEFAULT_BG = "/img/banner-1.jpg"
const DEFAULT_PILLS: CategoryPill[] = [
  { label: "Deals", href: "/deals" },
  { label: "Business", href: "/business" },
  { label: "Directory", href: "/explore" },
]

export default function HeroSection({
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  backgroundImage = DEFAULT_BG,
  categoryPills = DEFAULT_PILLS,
  children,
}: HeroSectionProps) {
  return (
    <div
      className="image-cover hero-header position-relative"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
      data-overlay="6"
    >
      <div className="container">
        <div className="row justify-content-center align-items-center mb-5 pt-lg-0 pt-5">
          <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
            <div className="position-relative text-center">
              <h1>{title}</h1>
              <p className="subtitle">{subtitle}</p>
            </div>
          </div>
        </div>

        {children}

        <div className="row align-items-center justify-content-center">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-2">
            <div className="text-center">
              <h6 className="fw-semibold">Explore</h6>
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            <div className="popularSearches d-flex align-items-center justify-content-center column-gap-3 row-gap-1 flex-wrap">
              {categoryPills.map((pill, i) => (
                <div className="singleItem" key={i}>
                  <Link href={pill.href} className="badge badge-transparent rounded-pill">
                    {pill.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mousedrop z-1">
        <Link href="#mains" className="mousewheel">
          <BsMouse className="" />
        </Link>
      </div>
    </div>
  )
}
