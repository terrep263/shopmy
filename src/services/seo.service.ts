import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface SEOMetadata {
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  seo_slug: string;
}

/**
 * Generate SEO metadata for a business
 */
export async function generateSEO(business: {
  name: string;
  category?: string;
  city?: string;
  address?: string;
}): Promise<SEOMetadata> {
  try {
    const prompt = `Generate SEO metadata for this business. Return ONLY valid JSON.

Business Name: ${business.name}
Category: ${business.category || "General"}
City: ${business.city || "Unknown"}
Address: ${business.address || ""}

Return this exact JSON structure (no other text):
{
  "seo_title": "A compelling 60-character title for search engines",
  "seo_description": "A compelling 160-character meta description",
  "seo_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "seo_slug": "url-safe-slug-with-hyphens"
}

Rules for slug: lowercase, hyphens only, no special characters, 3-50 characters.
Make title and description marketing optimized.
Keywords should be relevant to the business category and city.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const seo = JSON.parse(content);
    
    // Validate and sanitize the response
    return {
      seo_title: (seo.seo_title || "").substring(0, 60),
      seo_description: (seo.seo_description || "").substring(0, 160),
      seo_keywords: Array.isArray(seo.seo_keywords) 
        ? seo.seo_keywords.map((k: string) => k.substring(0, 30)) 
        : [],
      seo_slug: (seo.seo_slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "").substring(0, 50)
    };
  } catch (error) {
    console.error("Failed to generate SEO metadata:", error);
    
    // Return safe defaults
    return {
      seo_title: business.name.substring(0, 60),
      seo_description: `${business.name} in ${business.city || "your area"}. Find information, hours, and services.`.substring(0, 160),
      seo_keywords: [
        business.name.toLowerCase(),
        business.category?.toLowerCase() || "business",
        business.city?.toLowerCase() || "local"
      ],
      seo_slug: business.name
        .toLowerCase()
        .replace(/[^a-z0-9-\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50)
    };
  }
}
