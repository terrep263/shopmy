"use client"

import { useEffect, useState } from "react"
import MetricCard from "@/components/MetricCard"

export default function VendorDashboard() {

  const [stats, setStats] = useState({
    deals: 0,
    vouchers: 0,
    revenue: 0
  })

  useEffect(() => {

    const opts = { credentials: "include" as RequestCredentials }

    Promise.all([
      fetch("/api/vendor/deals", opts).then(res => res.json()),
      fetch("/api/vendor/vouchers", opts).then(res => res.json())
    ])
    .then(([deals, vouchers]) => {

      const dealList = Array.isArray(deals) ? deals : []
      const voucherList = Array.isArray(vouchers) ? vouchers : []

      setStats({
        deals: dealList.length,
        vouchers: voucherList.length,
        revenue: voucherList.length * 25
      })

    })

  }, [])

  return (

    <div>

      <h1 className="h2 fw-bold text-primary mb-4">Vendor Dashboard</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <MetricCard title="Active Deals" value={stats.deals} color="primary" />
        <MetricCard title="Vouchers Sold" value={stats.vouchers} color="success" />
        <MetricCard title="Revenue" value={`$${stats.revenue}`} color="info" />

      </div>

    </div>
  )
}
