/**
 * ListingHub Single Listing 04 — composed from ported theme components.
 * Mirrors: ListingHub/ListingHub_NextJs (Javascript)/src/app/single-listing-04/page.jsx
 */
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import NavbarDark from '@/components/theme/navbar/navbar-dark'
import Descriptions from '@/components/theme/list-detail/descriptions'
import Features from '@/components/theme/list-detail/features'
import Galleries from '@/components/theme/list-detail/galleries'
import Maps from '@/components/theme/list-detail/maps'
import Reviews from '@/components/theme/list-detail/reviews'
import List from '@/components/theme/list-detail/list'
import SingleSidebarFour from '@/components/theme/list-detail/single-sidebar-four'
import FooterTop from '@/components/theme/footer-top'
import Footer from '@/components/theme/footer/footer'
import BackToTop from '@/components/theme/back-to-top'

import { FaLocationDot } from 'react-icons/fa6'
import { BsBriefcase, BsStarFill, BsStarHalf, BsTelephone } from 'react-icons/bs'
import type { SerializableBusiness } from '@/lib/data/types'

interface SingleListing04Props {
  business?: SerializableBusiness
}

export default function SingleListing04({ business }: SingleListing04Props) {
  /* Dynamic values fall back to template defaults when no business data */
  const title = business?.name ?? 'Christmas Monday'
  const location = business
    ? `${business.city}${business.state ? ', ' + business.state : ''}`
    : 'Old Paris, France'
  const category = business?.category ?? business?.primary_type ?? 'Events'
  const phone = business?.national_phone_number ?? business?.international_phone_number ?? ''
  const heroImage = business?.photo_references?.[0] || '/img/single-4.jpg'
  const avatarImage = business?.photo_references?.[1] || '/img/logo-4.png'
  const reviewCount = business?.user_rating_count ?? '2k'
  const rating = business?.rating != null ? Number(business.rating) : 4.5
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.25

  return (
    <>
      <NavbarDark />

      <section className="bg-cover position-relative ht-500 py-0" style={{ backgroundImage: `url('${heroImage}')` }} data-overlay="4">
        <div className="container h-100">
          <div className="row align-items-start">
            <div className="col-xl-12 col-lg-12 col-md-12 col-12">
              <div className="mainlistingInfo">
                <div className="d-flex align-items-end justify-content-between flex-wrap gap-3">
                  <div className="firstColumn">
                    <div className="listingFirstinfo d-flex align-items-center justify-content-start gap-3 flex-wrap">
                      <div className="listingAvatar">
                        <Link href="#" className="d-block">
                          <Image src={avatarImage} width={95} height={95} className="img-fluid rounded-3" alt="Avatar" />
                        </Link>
                      </div>
                      <div className="listingCaptioninfo">
                        <div className="propertyTitlename d-flex align-items-center gap-2 mb-1">
                          <h2 className="fw-semibold text-light mb-0">{title}</h2>
                          <span className="verified mt-1"><img src="/img/tick.svg" className="img-fluid" width="22" alt="Verified Listing" /></span>
                        </div>
                        <div className="listingsbasicInfo">
                          <div className="d-flex align-items-center justify-content-start flex-wrap gap-2">
                            <div className="flexItem me-2"><span className="text-md fw-medium text-light"><FaLocationDot className="me-2" />{location}</span></div>
                            <div className="flexItem me-2"><span className="text-md fw-medium text-light"><BsBriefcase className="me-2" />{category}</span></div>
                            <div className="flexItem">
                              <div className="d-flex align-items-center justify-content-start gap-2">
                                <div className="d-flex align-items-center justify-content-start gap-1">
                                  {Array.from({ length: fullStars }).map((_, i) => (
                                    <BsStarFill key={`full-${i}`} className="text-warning text-sm" />
                                  ))}
                                  {hasHalf && <BsStarHalf className="text-warning text-sm" />}
                                </div>
                                <span className="text-md fw-medium text-light">({reviewCount} Reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lastColumn">
                    <div className="d-flex align-items-center justify-content-md-end flex-wrap gap-3">
                      <div className="flexStart Priceinfo d-flex flex-column">
                        <span className="fw-medium text-light">Event Time</span>
                        <span className="fw-bold text-md text-light">24 Nov 2024 - 10:30AM To 14:30PM</span>
                      </div>
                      <div className="flexlastButton">
                        <button type="button" className="btn px-4 btn-whites text-primary fw-medium rounded-pill"{...(phone ? { onClick: () => window.open(`tel:${phone}`) } : {})}><BsTelephone className="me-2" />{phone || 'Call Now'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gray-simple pt-4 pt-xl-5">
        <div data-bs-spy="scroll" data-bs-target="#scrollphyNav" data-bs-smooth-scroll="true" className="scrollspy-example" tabIndex={0}>
          <div className="container">
            <div className="row align-items-start gx-xl-5 g-4">
              <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                <Descriptions />
                <Features />
                <Galleries />
                <Maps />
                <Reviews />
                <List />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                <SingleSidebarFour />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterTop />
      <Footer />
      <BackToTop />
    </>
  )
}
