/**
 * BusinessCard — simple connector component for rendering a business.
 * Used as a standalone card outside the ListingHub template layouts.
 */
import Link from 'next/link'
import Image from 'next/image'
import type { SerializableBusiness } from '@/lib/data/types'

interface BusinessCardProps {
  business: SerializableBusiness
}

export default function BusinessCard({ business }: BusinessCardProps) {
  const logo = business.photo_references[0] || '/images/default-business.png'

  return (
    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
      <Link href={`/business/${business.id}`} className="text-decoration-none">
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
          <div className="position-relative" style={{ height: 200 }}>
            <Image
              src={logo}
              alt={business.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-fit-cover"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="card-body">
            <h5 className="card-title fw-semibold mb-1">{business.name}</h5>
            <p className="text-muted mb-1 small">
              {business.city}{business.state ? `, ${business.state}` : ''}
            </p>
            <p className="text-muted mb-0 small">{business.category}</p>
            {business.rating != null && (
              <div className="mt-2">
                <span className="badge bg-success">{business.rating} ★</span>
                {business.user_rating_count != null && (
                  <span className="text-muted small ms-2">
                    ({business.user_rating_count} reviews)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
