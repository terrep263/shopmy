"use client"

import { useState } from "react"

export default function CreateDealPage() {

  const [price, setPrice] = useState("")
  const [originalValue, setOriginalValue] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [loading, setLoading] = useState(false)

  async function createDeal() {

    setLoading(true)

    const res = await fetch("/api/deals/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        price: parseFloat(price),
        originalValue: parseFloat(originalValue),
        expirationDate
      })
    })

    const data = await res.json()

    setLoading(false)

    if (data.success) {
      alert("Deal created successfully")
      window.location.href = "/vendor/deals"
    } else {
      alert(data.error || "Deal creation failed")
    }
  }

  return (

    <div style={{ padding: 40 }}>

      <h1>Create AI Deal</h1>

      <input
        placeholder="Deal Price"
        type="number"
        step="any"
        value={price}
        onChange={e => setPrice(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Original Value"
        type="number"
        step="any"
        value={originalValue}
        onChange={e => setOriginalValue(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={expirationDate}
        onChange={e => setExpirationDate(e.target.value)}
      />

      <br /><br />

      <button onClick={createDeal} disabled={loading}>
        {loading ? "Generating..." : "Create Deal"}
      </button>

    </div>
  )
}
