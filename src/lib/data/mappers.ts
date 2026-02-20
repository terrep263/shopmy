/**
 * Client-safe data mappers — converts serializable DB records
 * to ListingHub template data formats.
 *
 * This file MUST NOT import from Prisma or any server-only module.
 * It is imported by 'use client' components.
 */
import type { SerializableBusiness, SerializableCategory } from './types'
import type { ListDataItem } from '@/components/theme/popular-listing-one'
import type { CategoryDataItem } from '@/components/theme/categories/category-one'
import type { IconType } from 'react-icons'
import {
  BsShop, BsHouseCheck, BsCupStraw, BsCupHot,
  BsBasket2, BsBackpack, BsLamp, BsLungs, BsLayers, BsCodeSlash
} from 'react-icons/bs'
import { FaDumbbell } from 'react-icons/fa6'

/* ------------------------------------------------------------------ */
/*  Category → Icon mapping                                           */
/* ------------------------------------------------------------------ */

const categoryIconMap: Record<string, { icon: IconType; style: string }> = {
  restaurant:   { icon: BsCupStraw,   style: 'catIcon me-2 cats-4' },
  restaurants:  { icon: BsCupStraw,   style: 'catIcon me-2 cats-4' },
  food:         { icon: BsCupStraw,   style: 'catIcon me-2 cats-4' },
  cafe:         { icon: BsCupHot,     style: 'catIcon me-2 cats-6' },
  coffee:       { icon: BsCupHot,     style: 'catIcon me-2 cats-6' },
  gym:          { icon: FaDumbbell,   style: 'catIcon me-2 cats-1' },
  fitness:      { icon: FaDumbbell,   style: 'catIcon me-2 cats-1' },
  'real estate':{ icon: BsHouseCheck, style: 'catIcon me-2 cats-2' },
  shopping:     { icon: BsBasket2,    style: 'catIcon me-2 cats-8' },
  retail:       { icon: BsBasket2,    style: 'catIcon me-2 cats-8' },
  store:        { icon: BsBasket2,    style: 'catIcon me-2 cats-8' },
  wedding:      { icon: BsLamp,      style: 'catIcon me-2 cats-3' },
  events:       { icon: BsLamp,      style: 'catIcon me-2 cats-3' },
  medical:      { icon: BsLungs,     style: 'catIcon me-2 cats-8' },
  health:       { icon: BsLungs,     style: 'catIcon me-2 cats-8' },
  hospital:     { icon: BsLungs,     style: 'catIcon me-2 cats-8' },
  showroom:     { icon: BsBackpack,  style: 'catIcon me-2 cats-6' },
  finance:      { icon: BsLayers,    style: 'catIcon me-2 cats-5' },
  beauty:       { icon: BsBasket2,   style: 'catIcon me-2 cats-8' },
  spa:          { icon: BsCupHot,    style: 'catIcon me-2 cats-6' },
  tech:         { icon: BsCodeSlash, style: 'catIcon me-2 cats-5' },
  automotive:   { icon: BsBackpack,  style: 'catIcon me-2 cats-6' },
}

function getIconForCategory(category: string): { icon: IconType; style: string } {
  const lower = (category || '').toLowerCase()
  for (const [key, value] of Object.entries(categoryIconMap)) {
    if (lower.includes(key)) return value
  }
  return { icon: BsShop, style: 'catIcon me-2 cats-5' }
}

/* ------------------------------------------------------------------ */
/*  Business → ListDataItem (used by GridLayout04, ListLayout02, etc.) */
/* ------------------------------------------------------------------ */

export function businessToListItem(b: SerializableBusiness): ListDataItem {
  const iconInfo = getIconForCategory(b.category || b.primary_type || '')

  return {
    id: b.id,
    image: b.photo_references[0] || '/img/list-1.jpg',
    user: b.photo_references[1] || '/img/team-1.jpg',
    status: b.business_status === 'CLOSED_PERMANENTLY' || b.business_status === 'CLOSED_TEMPORARILY'
      ? 'closed'
      : 'open',
    featured: b.is_verified,
    title: b.name,
    desc: b.ai_summary || b.editorial_summary || `${b.category} in ${b.city}`,
    call: b.national_phone_number || b.international_phone_number || '',
    loction: `${b.city}${b.state ? ', ' + b.state : ''}`,
    tag: b.category || b.primary_type || 'Business',
    tagIcon: iconInfo.icon,
    tagIconStyle: iconInfo.style,
    review: b.user_rating_count ? `${b.user_rating_count} Reviews` : '0 Reviews',
    rating:
      b.rating != null && b.rating >= 4.5 ? 'excellent' :
      b.rating != null && b.rating >= 4   ? 'good'      : 'midium',
    ratingRate: b.rating != null ? String(b.rating) : '0.0',
    instantBooking: false,
  }
}

/* ------------------------------------------------------------------ */
/*  Category → CategoryDataItem (used by CategoryOne)                  */
/* ------------------------------------------------------------------ */

export function categoryToDisplayItem(c: SerializableCategory): CategoryDataItem {
  const iconInfo = getIconForCategory(c.name || c.google_type || '')

  return {
    image: '/img/cats/catt-1.jpg',
    icon: iconInfo.icon,
    title: c.name,
    list: `${c.businessCount} Lists`,
  }
}
