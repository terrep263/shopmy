'use client'

/**
 * Full-page layout for ListingHub theme routes.
 * Renders theme header, content, footer, and back-to-top.
 */
import ThemeHeader from './ThemeHeader'
import ThemeFooter from './ThemeFooter'
import BackToTop from '@/components/theme/back-to-top'

export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ThemeHeader />
      {children}
      <ThemeFooter />
      <BackToTop />
    </>
  )
}
