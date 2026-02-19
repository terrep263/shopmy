import FooterTop from "@/components/theme/footer-top"

export interface NewsletterSectionProps {
  title?: string
  subtitle?: string
}

/** Newsletter signup strip. Renders ListingHub FooterTop (subscribe section). */
export default function NewsletterSection(_props?: NewsletterSectionProps) {
  return <FooterTop />
}
