"use client"

import { useEffect, useState } from "react"

export default function VendorVouchersPage() {

  const [vouchers, setVouchers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetch("/api/vendor/vouchers", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setVouchers(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

  }, [])

  if (loading)
    return <div style={{ padding: 40 }}>Loading vouchers...</div>

  return (

    <div style={{ padding: 40 }}>

      <h1>Issued Vouchers</h1>

      {vouchers.length === 0 && (
        <p>No vouchers issued yet.</p>
      )}

      {vouchers.map(v => (

        <div key={v.id}
          style={{
            border: "1px solid #ccc",
            padding: 20,
            marginBottom: 10
          }}
        >

          <p>Voucher: {v.uuid}</p>

          <p>Status: {v.status}</p>

          <p>Deal: {v.deal?.title}</p>

        </div>

      ))}

    </div>
  )
}
