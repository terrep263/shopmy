"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function DealDetailPage() {

  const params = useParams()

  const [deal, setDeal] = useState<any>(null)

  const [email, setEmail] = useState("")

  const [loading, setLoading] = useState(true)

  const [purchasing, setPurchasing] = useState(false)

  const dealId = typeof params.id === "string" ? params.id : params.id?.[0]

  useEffect(() => {

    if (!dealId) return

    fetch("/api/deals/public/" + dealId)
      .then(res => {
        if (!res.ok) return null
        return res.json()
      })
      .then(data => {
        setDeal(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

  }, [dealId])

  async function purchase() {

    if (!email.trim()) {
      alert("Please enter your email")
      return
    }

    setPurchasing(true)

    const res = await fetch("/api/deals/purchase", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        dealId,
        customerEmail: email.trim()
      })
    })

    setPurchasing(false)

    if (res.ok) {

      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")

      a.href = url

      a.download = "voucher.pdf"

      a.click()

      window.URL.revokeObjectURL(url)

    } else {

      const data = await res.json().catch(() => ({}))
      alert(data.error || "Purchase failed")
    }
  }

  if (loading)
    return <div style={{ padding: 40 }}>Loading deal...</div>

  if (!deal)
    return (
      <div style={{ padding: 40 }}>
        <p>Deal not found.</p>
        <a href="/deals">Back to deals</a>
      </div>
    )

  return (

    <div style={{ padding: 40 }}>

      <h1>{deal.title}</h1>

      <p>{deal.description}</p>

      <p>
        Business: {deal.vendor?.business?.name}
      </p>

      <p>
        Price: ${deal.price}
      </p>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={purchase} disabled={purchasing}>
        {purchasing ? "Processing..." : "Buy Deal"}
      </button>

    </div>
  )
}
