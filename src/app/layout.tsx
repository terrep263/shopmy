import type { Metadata } from "next"
import Script from "next/script"
import BrandingProvider from "@/components/BrandingProvider"
/* ListingHub as primary frontend controller – global theme only. No AppShell/Sidebar. */
import "bootstrap/dist/css/bootstrap.min.css"
import "animate.css/animate.css"
import "@/styles/listinghub/style.scss"
import "./puck.css"

export const metadata: Metadata = {
  title: "ShopMyNeighborhood",
  description: "Discover deals. Support local businesses. Strengthen your community.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <BrandingProvider />
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
