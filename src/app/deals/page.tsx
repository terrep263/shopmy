"use client"

import { useEffect, useState } from "react"
import DealCard from "@/components/DealCard"

export default function DealsPage() {

  const [deals, setDeals] = useState<any[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetch("/api/deals/public")
      .then(res => res.json())
      .then(data => {
        setDeals(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

  }, [])

  return (

    <div>

      <div className="bg-primary text-white p-5 rounded mb-4 shadow">
        <h1 className="h2 fw-bold mb-2">Explore Your Neighborhood</h1>
        <p className="mb-0">Discover exclusive local deals and support your community.</p>
      </div>

      {loading && <p className="text-muted mb-4">Loading deals...</p>}

      {!loading && deals.length === 0 && (
        <p className="text-muted mb-4">No published deals right now. Check back soon!</p>
      )}

      <div className="row row-cols-1 row-cols-md-3 g-4">

        {deals.map(deal => (
          <DealCard key={deal.id} deal={deal} />
        ))}

      </div>

    </div>
  )
}
