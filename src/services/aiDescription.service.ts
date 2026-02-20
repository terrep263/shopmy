import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface BusinessData {
  name: string
  category?: string
  address: string
}

/**
 * Generate a professional 200-word business description using OpenAI
 */
export async function generateBusinessDescription(business: BusinessData): Promise<string> {
  try {
    const prompt = `Write a professional, engaging 200-word business description for:

Business Name: ${business.name}
${business.category ? `Category: ${business.category}` : ''}
Address: ${business.address}

Requirements:
- Professional and engaging tone
- Marketing optimized
- Highlight services and customer value
- Make business sound trustworthy and appealing
- Approximately 200 words

Write only the description, no intro or outro.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const description = response.choices[0]?.message?.content?.trim() || ''
    return description
  } catch (error) {
    console.error('Error generating business description:', error)
    return `${business.name} is a business located at ${business.address}. We provide quality services to our community.`
  }
}
