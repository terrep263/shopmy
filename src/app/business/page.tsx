"use client"

import { useEffect, useState } from "react"

export default function BusinessPage() {

  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/business/list")
      .then(res => res.json())
      .then(data => {
        setBusinesses(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch("/api/auth/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setRole(data?.role ?? null))
      .catch(() => setRole(null))
  }, [])

  async function claimBusiness(id: string) {

    const res = await fetch("/api/vendor/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        businessId: id
      })
    })

    const data = await res.json()

    if (res.ok) {
      alert("Business claimed successfully")
      window.location.href = "/vendor/dashboard"
    } else {
      alert(data.error || "Claim failed")
    }
  }

  if (loading)
    return <div style={{ padding: 40 }}>Loading businesses...</div>

  return (

    <div style={{ padding: 40 }}>

      <h1>Available Businesses</h1>

      {businesses.length === 0 && (
        <p>No businesses listed yet.</p>
      )}

      {businesses.map(business => (

        <div key={business.id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 10
          }}
        >

          <h3>{business.name}</h3>

          <p>{business.address}</p>

          <p>{business.city}</p>

          {!business.claimed && role === "vendor" && (

            <button onClick={() => claimBusiness(business.id)}>
              Claim Business
            </button>

          )}

          {business.claimed && (

            <span>Already Claimed</span>

          )}

        </div>

      ))}

    </div>
  )
}
