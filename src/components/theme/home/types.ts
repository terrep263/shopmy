import type { IconType } from "react-icons"

/** Hero / category pill for the hero section */
export interface CategoryPill {
  label: string
  href: string
}

/** Category item for CategorySection (business categories) */
export interface CategoryItem {
  image: string
  icon: IconType
  title: string
  list: string
  href?: string
}

/** Listing item for TrendingListingsSection (deals/businesses) */
export interface ListingItem {
  id: number
  image: string
  user: string
  status: string
  featured: boolean
  title: string
  desc: string
  call: string
  loction: string
  tag: string
  tagIcon: IconType
  tagIconStyle: string
  review: string
  rating: string
  ratingRate: string
  instantBooking: boolean
  href?: string
}

/** Review item for ReviewsSection */
export interface ReviewItem {
  rate: IconType[]
  title: string
  desc: string
  image: string
  name: string
  position: string
}

/** Blog post for BlogSection */
export interface BlogPostItem {
  id: number
  image: string
  title: string
  desc: string
  date: string
  views: string
  href?: string
}

/** Search bar category option */
export interface SearchCategoryOption {
  value: string
  label: string
}
