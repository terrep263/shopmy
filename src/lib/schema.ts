/**
 * Schema Markup Generator
 * Generates structured data for SEO and search engine optimization
 */

export interface SchemaMarkupData {
  "@context": string;
  "@type": string;
  name: string;
  description?: string;
  image?: string | string[];
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality?: string;
  };
  geo?: {
    "@type": string;
    latitude: number;
    longitude: number;
  };
  url?: string;
}

/**
 * Generate Schema.org LocalBusiness markup for a business
 */
export function generateBusinessSchema(business: {
  name: string;
  description?: string;
  image_url?: string;
  image_urls?: string[];
  address: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  seo_slug?: string;
}): SchemaMarkupData {
  const schema: SchemaMarkupData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city || ""
    }
  };

  // Add description if available
  if (business.description) {
    schema.description = business.description;
  }

  // Add images
  const images = [
    business.image_url,
    ...(business.image_urls || [])
  ].filter((img): img is string => !!img);

  if (images.length > 0) {
    schema.image = images.length === 1 ? images[0] : images;
  }

  // Add geographic coordinates
  if (business.latitude !== undefined && business.longitude !== undefined) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: business.latitude,
      longitude: business.longitude
    };
  }

  // Add URL if slug is available
  if (business.seo_slug) {
    schema.url = `/business/${business.seo_slug}`;
  }

  return schema;
}

/**
 * Generate Organization schema for branding
 */
export function generateOrganizationSchema(org: {
  name: string;
  logo?: string;
  url?: string;
  description?: string;
}): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    ...(org.logo && { logo: org.logo }),
    ...(org.url && { url: org.url }),
    ...(org.description && { description: org.description })
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: {
  name: string;
  url?: string;
}[]): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url })
    }))
  };
}

/**
 * Convert schema objects to JSON-LD format
 */
export function toJsonLd(schema: Record<string, any>): string {
  return JSON.stringify(schema);
}
