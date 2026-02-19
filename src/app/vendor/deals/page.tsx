"use client"

import { useEffect, useState } from "react"

export default function VendorDealsPage() {

  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetch("/api/vendor/deals", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setDeals(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

  }, [])

  if (loading)
    return <div style={{ padding: 40 }}>Loading deals...</div>

  return (

    <div style={{ padding: 40 }}>

      <h1>Your Deals</h1>

      <a href="/vendor/deals/create">
        Create New Deal
      </a>

      <br /><br />

      {deals.length === 0 && (
        <p>No deals yet. Create your first deal above.</p>
      )}

      {deals.map(deal => (

        <div key={deal.id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 10
          }}
        >

          <h3>{deal.title}</h3>

          <p>{deal.description}</p>

          <p>Price: ${deal.price}</p>

          <p>Status: {deal.status}</p>

        </div>

      ))}

    </div>
  )
}
