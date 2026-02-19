"use client"

import React from "react"
import dynamic from "next/dynamic"
import { FaLocationDot } from "react-icons/fa6"
import { BiSearch } from "react-icons/bi"
import type { SearchCategoryOption } from "./types"

const Select = dynamic(() => import("react-select"), { ssr: false })

export interface SearchBarProps {
  searchPlaceholder?: string
  locationPlaceholder?: string
  categoryOptions?: SearchCategoryOption[]
  categoryPlaceholder?: string
  onSearch?: (query: { search?: string; location?: string; category?: string }) => void
}

const DEFAULT_CATEGORIES: SearchCategoryOption[] = [
  { value: "1", label: "Eat & Drinking" },
  { value: "2", label: "Rental Property" },
  { value: "3", label: "Classifieds" },
  { value: "4", label: "Bank Services" },
  { value: "5", label: "Shopping" },
  { value: "6", label: "Fitness & Gym" },
  { value: "7", label: "Coaching" },
  { value: "8", label: "Other Services" },
]

export default function SearchBar({
  searchPlaceholder = "What are you looking for?",
  locationPlaceholder = "Location",
  categoryOptions = DEFAULT_CATEGORIES,
  categoryPlaceholder = "Category",
  onSearch,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const search = (form.querySelector('[name="search"]') as HTMLInputElement)?.value
    const location = (form.querySelector('[name="location"]') as HTMLInputElement)?.value
    onSearch?.({ search, location })
  }

  return (
    <div className="row align-items-start justify-content-center mb-lg-5 mb-4">
      <div className="col-xl-11 col-lg-12 col-md-12 col-sm-12">
        <form onSubmit={handleSubmit} className="heroSearch style-01 shadow">
          <div className="row gx-lg-2 gx-md-2 gx-3 gy-sm-2 gy-2">
            <div className="col-xl-4 col-lg-3 col-md-12 col-sm-12">
              <div className="form-group position-relative">
                <input
                  type="text"
                  name="search"
                  className="form-control fs-6 fw-medium border-0 ps-md-2"
                  placeholder={searchPlaceholder}
                />
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 side-border">
              <div className="form-group position-relative">
                <input
                  type="text"
                  name="location"
                  className="form-control fs-6 fw-medium border-0"
                  placeholder={locationPlaceholder}
                />
                <span className="position-absolute top-50 end-0 translate-middle me-2">
                  <FaLocationDot className="fa-solid fa-location-dot text-muted opacity-50 fs-5" />
                </span>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
              <div className="form-group fw-medium lights-bg no-border">
                <div className="selects">
                  <Select
                    placeholder={categoryPlaceholder}
                    options={categoryOptions}
                    className="categories form-control border-0"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-12 col-sm-12">
              <div className="form-group">
                <button type="submit" className="btn btn-primary full-width fw-medium">
                  <BiSearch className="me-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
