import { Config } from "@measured/puck"
import NavbarDark from "@/components/theme/navbar/navbar-dark"
import ExploreListingOne from "@/components/theme/explore-listing-one"
import ExploreCity from "@/components/theme/explore-city"
import AboutOne from "@/components/theme/about-one"
import ClientOne from "@/components/theme/client-one"
import BlogOne from "@/components/theme/blog-one"
import FooterTop from "@/components/theme/footer-top"
import Footer from "@/components/theme/footer/footer"
import BackToTop from "@/components/theme/back-to-top"
import { categoryData } from "@/lib/theme-data"
import { BsMouse, BsSearch, BsCheck2Circle, BsExclamationTriangle, BsInfoCircle, BsXCircle } from "react-icons/bs"
import { IconType } from "react-icons"
import Link from "next/link"
import MediaLibraryField from "@/components/admin/MediaLibraryField"
import React from "react"

interface CategoryData {
  image: string
  icon: IconType
  title: string
  list: string
}

const mediaField = (label: string) => ({
  type: "custom" as const,
  label,
  render: ({ value, onChange }: { value?: string; onChange: (value: string) => void }) => (
    <MediaLibraryField value={value} onChange={onChange} label={label} />
  ),
})

// Define component blocks for Puck with MAXIMUM features
export type UserConfig = {
  // Navigation & Header
  NavbarBlock: {}
  
  // Hero & Banner Sections
  HeroBlock: {
    title: string
    subtitle?: string
    backgroundImage?: string
    ctaText?: string
    ctaLink?: string
    showSearch?: boolean
    overlay?: number
    height?: string
  }
  
  // Content Blocks
  CategoryGridBlock: {}
  ExploreListingsBlock: {}
  ExploreCityBlock: {}
  AboutBlock: {}
  ReviewsBlock: {}
  BlogBlock: {}
  
  // Footer
  FooterTopBlock: {}
  FooterBlock: {}
  BackToTopBlock: {}
  
  // Enhanced Grids with full customization
  BusinessGridBlock: {
    title?: string
    limit?: number
    columns?: number
    showFilters?: boolean
    backgroundColor?: string
  }
  DealGridBlock: {
    title?: string
    limit?: number
    columns?: number
    showDiscounts?: boolean
    backgroundColor?: string
  }
  BlogListBlock: {
    title?: string
    limit?: number
    showAuthor?: boolean
    showDate?: boolean
  }
  
  // NEW: Rich Text & Typography
  HeadingBlock: {
    text: string
    level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
    align?: "left" | "center" | "right"
    color?: string
    marginTop?: string
    marginBottom?: string
  }
  
  TextBlock: {
    content: string
    fontSize?: string
    color?: string
    align?: "left" | "center" | "right" | "justify"
    fontWeight?: "normal" | "bold" | "light"
  }
  
  RichTextBlock: {
    html: string
    maxWidth?: string
  }
  
  // NEW: Layout Components
  ContainerBlock: {
    maxWidth?: string
    padding?: string
    backgroundColor?: string
    borderRadius?: string
  }
  
  ColumnsBlock: {
    columns?: number
    gap?: string
    alignItems?: "start" | "center" | "end" | "stretch"
  }
  
  SpacerBlock: {
    height?: string
  }
  
  DividerBlock: {
    thickness?: string
    color?: string
    style?: "solid" | "dashed" | "dotted"
    marginTop?: string
    marginBottom?: string
  }
  
  // NEW: Media Components
  ImageBlock: {
    src: string
    alt: string
    width?: string
    height?: string
    objectFit?: "cover" | "contain" | "fill" | "none"
    borderRadius?: string
    caption?: string
  }
  
  ImageGalleryBlock: {
    images: Array<{ src: string; alt: string; caption?: string }>
    columns?: number
    gap?: string
    aspectRatio?: string
  }
  
  VideoBlock: {
    src: string
    autoplay?: boolean
    loop?: boolean
    controls?: boolean
    aspectRatio?: string
  }
  
  // NEW: Interactive Components
  ButtonBlock: {
    text: string
    link: string
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info"
    size?: "sm" | "md" | "lg"
    fullWidth?: boolean
    openInNewTab?: boolean
  }
  
  ButtonGroupBlock: {
    buttons: Array<{
      text: string
      link: string
      variant?: string
    }>
    align?: "left" | "center" | "right"
    spacing?: string
  }
  
  AlertBlock: {
    message: string
    variant?: "info" | "success" | "warning" | "danger"
    dismissible?: boolean
    icon?: boolean
  }
  
  // NEW: Card & Feature Components
  CardBlock: {
    title: string
    content: string
    image?: string
    link?: string
    buttonText?: string
    align?: "left" | "center"
  }
  
  FeatureBlock: {
    icon?: string
    title: string
    description: string
    align?: "left" | "center"
    iconColor?: string
  }
  
  StatsBlock: {
    stats: Array<{
      number: string
      label: string
      suffix?: string
    }>
    columns?: number
    backgroundColor?: string
  }
  
  TestimonialBlock: {
    quote: string
    author: string
    role?: string
    image?: string
    rating?: number
  }
  
  // NEW: Call-to-Action Components
  CTABannerBlock: {
    title: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    backgroundColor?: string
    textColor?: string
    backgroundImage?: string
  }
  
  NewsletterBlock: {
    title: string
    description?: string
    placeholder?: string
    buttonText?: string
    backgroundColor?: string
  }
  
  // NEW: Social & Contact
  SocialLinksBlock: {
    links: Array<{
      platform: string
      url: string
    }>
    size?: "sm" | "md" | "lg"
    align?: "left" | "center" | "right"
  }
  
  ContactFormBlock: {
    title?: string
    fields: Array<string>
    submitText?: string
    backgroundColor?: string
  }
  
  MapBlock: {
    address: string
    zoom?: number
    height?: string
  }
  
  // NEW: E-commerce Components
  PricingTableBlock: {
    plans: Array<{
      name: string
      price: string
      features: string[]
      buttonText?: string
      highlighted?: boolean
    }>
    columns?: number
  }
  
  ProductCardBlock: {
    name: string
    price: number
    image?: string
    description?: string
    rating?: number
    badge?: string
  }
  
  // NEW: Custom HTML
  HTMLBlock: {
    html: string
    wrapper?: "div" | "section" | "article" | "aside"
  }
  
  // NEW: Accordion & Tabs
  AccordionBlock: {
    items: Array<{
      title: string
      content: string
    }>
    defaultOpen?: number
  }
  
  TabsBlock: {
    tabs: Array<{
      title: string
      content: string
    }>
  }
}

// Puck configuration
export const config: Config<UserConfig> = {
  components: {
    NavbarBlock: {
      fields: {},
      defaultProps: {},
      render: () => <NavbarDark />,
    },

    HeroBlock: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        backgroundImage: mediaField("Background Image"),
      },
      defaultProps: {
        title: "Browse Nearby Restaurant",
        subtitle: "Browse high-rated hotels, restaurants, attractions, activities and more!",
        backgroundImage: "/img/banner-8.jpg",
      },
      render: ({ title, subtitle, backgroundImage }) => (
        <div
          className="image-cover hero-header bg-primary position-relative"
          style={{ backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined }}
          data-overlay="6"
        >
          <div className="container position-relative z-1">
            <div className="row justify-content-center align-items-center mb-5 pt-lg-0 pt-5">
              <div className="col-xl-10 col-lg-11 col-md-12 col-sm-12">
                <div className="position-relative text-center">
                  <h1>{title}</h1>
                  <p className="fs-5 fw-light">{subtitle}</p>
                </div>
              </div>
            </div>

            <div className="row align-items-start justify-content-center mb-lg-5 mb-4">
              <div className="col-xl-8 col-lg-10 col-md-12 col-sm-12">
                <div className="heroSearch rounded-search style-01">
                  <div className="row gx-lg-2 gx-md-2 gx-3 gy-sm-2 gy-2">
                    <div className="col-xl-10 col-lg-9 col-md-8 col-sm-12">
                      <div className="form-group position-relative">
                        <input
                          type="text"
                          className="form-control fs-6 fw-medium border-0"
                          placeholder="What are you looking for?"
                        />
                        <div className="position-absolute top-50 end-0 translate-middle-y d-md-block d-none">
                          <span className="badge badge-xs badge-primary rounded-pill">
                            22k listing found
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-12">
                      <div className="form-group">
                        <button type="button" className="btn btn-primary full-width fw-medium rounded-pill">
                          <BsSearch className="me-2" />
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mousedrop z-1">
            <Link href="#mains" className="mousewheel center">
              <BsMouse />
            </Link>
          </div>
        </div>
      ),
    },

    CategoryGridBlock: {
      fields: {},
      defaultProps: {},
      render: () => (
        <section className="bg-dark" id="mains">
          <div className="container">
            <div className="row row-cols-xl-6 row-cols-lg-6 row-cols-md-5 row-cols-sm-3 row-cols-2 g-xl-4 g-3">
              {categoryData.map((item: CategoryData, index: number) => {
                const Icon = item.icon
                return (
                  <div className="col" key={index}>
                    <div className="cardio">
                      <Link href="#" className="cats-modern">
                        <div className="cats-icons">
                          <Icon />
                        </div>
                        <div className="cats-titles">
                          <h5>{item.title}</h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ),
    },

    ExploreListingsBlock: {
      fields: {},
      defaultProps: {},
      render: () => <ExploreListingOne />,
    },

    ExploreCityBlock: {
      fields: {},
      defaultProps: {},
      render: () => <ExploreCity />,
    },

    AboutBlock: {
      fields: {},
      defaultProps: {},
      render: () => <AboutOne />,
    },

    ReviewsBlock: {
      fields: {},
      defaultProps: {},
      render: () => <ClientOne />,
    },

    BlogBlock: {
      fields: {},
      defaultProps: {},
      render: () => <BlogOne />,
    },

    FooterTopBlock: {
      fields: {},
      defaultProps: {},
      render: () => <FooterTop />,
    },

    FooterBlock: {
      fields: {},
      defaultProps: {},
      render: () => <Footer />,
    },

    BackToTopBlock: {
      fields: {},
      defaultProps: {},
      render: () => <BackToTop />,
    },

    BusinessGridBlock: {
      fields: {
        title: { type: "text" },
        limit: { type: "number" },
      },
      defaultProps: {
        title: "Featured Businesses",
        limit: 6,
      },
      render: ({ title, limit }) => (
        <div className="business-grid-block py-5">
          <div className="container">
            {title && <h2 className="mb-4">{title}</h2>}
            <div className="row">
              {Array.from({ length: limit || 6 }).map((_, i) => (
                <div key={i} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Business {i + 1}</h5>
                      <p className="card-text">Business placeholder content</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    DealGridBlock: {
      fields: {
        title: { type: "text" },
        limit: { type: "number" },
      },
      defaultProps: {
        title: "Hot Deals",
        limit: 6,
      },
      render: ({ title, limit }) => (
        <div className="deal-grid-block py-5 bg-light">
          <div className="container">
            {title && <h2 className="mb-4">{title}</h2>}
            <div className="row">
              {Array.from({ length: limit || 6 }).map((_, i) => (
                <div key={i} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Deal {i + 1}</h5>
                      <p className="card-text">Deal placeholder content</p>
                      <span className="badge bg-danger">50% OFF</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    BlogListBlock: {
      fields: {
        title: { type: "text" },
        limit: { type: "number" },
      },
      defaultProps: {
        title: "Latest Blog Posts",
        limit: 3,
      },
      render: ({ title, limit }) => (
        <div className="blog-list-block py-5">
          <div className="container">
            {title && <h2 className="mb-4">{title}</h2>}
            <div className="row">
              {Array.from({ length: limit || 3 }).map((_, i) => (
                <div key={i} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Blog Post {i + 1}</h5>
                      <p className="card-text">Blog post preview content goes here...</p>
                      <a href="#" className="btn btn-sm btn-primary">
                        Read More
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },

    // =====================
    // TYPOGRAPHY BLOCKS
    // =====================
    HeadingBlock: {
      fields: {
        text: { type: "text", label: "Heading Text" },
        level: {
          type: "select",
          label: "Level",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
            { label: "H5", value: "h5" },
            { label: "H6", value: "h6" },
          ]
        },
        align: {
          type: "select",
          label: "Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ]
        },
        color: { type: "text", label: "Color" },
      },
      defaultProps: {
        text: "Your Heading Here",
        level: "h2",
        align: "left",
        color: "",
      },
      render: ({ text, level, align, color }) => {
        const Tag = (level || "h2") as keyof React.JSX.IntrinsicElements
        return <Tag style={{ textAlign: align as "left" | "center" | "right", color: color || 'inherit' }}>{text}</Tag>
      },
    },

    TextBlock: {
      fields: {
        content: { type: "textarea", label: "Text Content" },
        fontSize: { type: "text", label: "Font Size" },
        color: { type: "text", label: "Color" },
        align: {
          type: "select",
          label: "Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ]
        },
      },
      defaultProps: {
        content: "Your text content goes here.",
        fontSize: "16px",
        color: "",
        align: "left",
      },
      render: ({ content, fontSize, color, align }) => (
        <p style={{ fontSize: fontSize || '16px', color: color || 'inherit', textAlign: align as "left" | "center" | "right" }}>
          {content}
        </p>
      ),
    },

    // =====================
    // LAYOUT BLOCKS
    // =====================
    SpacerBlock: {
      fields: {
        height: { type: "text", label: "Height (e.g., 2rem)" },
      },
      defaultProps: {
        height: "2rem",
      },
      render: ({ height }) => <div style={{ height: height || '2rem' }} />,
    },

    DividerBlock: {
      fields: {
        thickness: { type: "text", label: "Thickness" },
        color: { type: "text", label: "Color" },
        marginTop: { type: "text", label: "Top Margin" },
        marginBottom: { type: "text", label: "Bottom Margin" },
      },
      defaultProps: {
        thickness: "1px",
        color: "#dee2e6",
        marginTop: "1rem",
        marginBottom: "1rem",
      },
      render: ({ thickness, color, marginTop, marginBottom }) => (
        <hr style={{
          borderTop: `${thickness || '1px'} solid ${color || '#dee2e6'}`,
          marginTop: marginTop || '1rem',
          marginBottom: marginBottom || '1rem',
        }} />
      ),
    },

    // =====================
    // MEDIA BLOCKS
    // =====================
    ImageBlock: {
      fields: {
        src: mediaField("Image"),
        alt: { type: "text", label: "Alt Text" },
        width: { type: "text", label: "Width (e.g., 100%)" },
        borderRadius: { type: "text", label: "Border Radius" },
        caption: { type: "text", label: "Caption" },
      },
      defaultProps: {
        src: "/img/placeholder.jpg",
        alt: "Image",
        width: "100%",
        borderRadius: "0",
        caption: "",
      },
      render: ({ src, alt, width, borderRadius, caption }) => (
        <figure style={{ margin: 0 }}>
          <img 
            src={src} 
            alt={alt} 
            style={{ width: width || '100%', borderRadius: borderRadius || '0', display: 'block' }} 
          />
          {caption && <figcaption className="text-center text-muted mt-2">{caption}</figcaption>}
        </figure>
      ),
    },

    VideoBlock: {
      fields: {
        src: { type: "text", label: "Video URL" },
        controls: { type: "radio", label: "Show Controls", options: [
          { label: "Yes", value: true },
          { label: "No", value: false }
        ]},
      },
      defaultProps: {
        src: "",
        controls: true,
      },
      render: ({ src, controls }) => (
        <video src={src} controls={controls} style={{ width: '100%' }} />
      ),
    },

    // =====================
    // INTERACTIVE BLOCKS
    // =====================
    ButtonBlock: {
      fields: {
        text: { type: "text", label: "Button Text" },
        link: { type: "text", label: "Link" },
        variant: {
          type: "select",
          label: "Style",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Success", value: "success" },
            { label: "Danger", value: "danger" },
          ]
        },
        size: {
          type: "select",
          label: "Size",
          options: [
            { label: "Small", value: "sm" },
            { label: "Medium", value: "md" },
            { label: "Large", value: "lg" },
          ]
        },
      },
      defaultProps: {
        text: "Click Me",
        link: "#",
        variant: "primary",
        size: "md",
      },
      render: ({ text, link, variant, size }) => (
        <a href={link} className={`btn btn-${variant || 'primary'} btn-${size || 'md'}`}>
          {text}
        </a>
      ),
    },

    AlertBlock: {
      fields: {
        message: { type: "textarea", label: "Message" },
        variant: {
          type: "select",
          label: "Type",
          options: [
            { label: "Info", value: "info" },
            { label: "Success", value: "success" },
            { label: "Warning", value: "warning" },
            { label: "Danger", value: "danger" },
          ]
        },
      },
      defaultProps: {
        message: "This is an alert message",
        variant: "info",
      },
      render: ({ message, variant }) => {
        const icons = {
          info: BsInfoCircle,
          success: BsCheck2Circle,
          warning: BsExclamationTriangle,
          danger: BsXCircle,
        }
        const Icon = icons[variant as keyof typeof icons] || BsInfoCircle
        return (
          <div className={`alert alert-${variant}`} role="alert">
            <Icon className="me-2" />
            {message}
          </div>
        )
      },
    },

    // =====================
    // CARD BLOCKS
    // =====================
    CardBlock: {
      fields: {
        title: { type: "text", label: "Title" },
        content: { type: "textarea", label: "Content" },
        image: mediaField("Image"),
        buttonText: { type: "text", label: "Button Text" },
      },
      defaultProps: {
        title: "Card Title",
        content: "Card content goes here",
        image: "",
        buttonText: "Learn More",
      },
      render: ({ title, content, image, buttonText }) => (
        <div className="card">
          {image && <img src={image} className="card-img-top" alt={title} />}
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{content}</p>
            {buttonText && <a href="#" className="btn btn-primary">{buttonText}</a>}
          </div>
        </div>
      ),
    },

    // =====================
    // CALL-TO-ACTION
    // =====================
    CTABannerBlock: {
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "textarea", label: "Subtitle" },
        buttonText: { type: "text", label: "Button Text" },
        buttonLink: { type: "text", label: "Button Link" },
        backgroundColor: { type: "text", label: "Background Color" },
      },
      defaultProps: {
        title: "Ready to Get Started?",
        subtitle: "Join thousands of satisfied customers today",
        buttonText: "Get Started Now",
        buttonLink: "#",
        backgroundColor: "#0d6efd",
      },
      render: ({ title, subtitle, buttonText, buttonLink, backgroundColor }) => (
        <div 
          className="cta-banner py-5 text-white text-center"
          style={{ backgroundColor: backgroundColor || '#0d6efd' }}
        >
          <div className="container">
            <h2 className="mb-3">{title}</h2>
            {subtitle && <p className="lead mb-4">{subtitle}</p>}
            {buttonText && buttonLink && (
              <a href={buttonLink} className="btn btn-light btn-lg">
                {buttonText}
              </a>
            )}
          </div>
        </div>
      ),
    },
  },
}

export default config
