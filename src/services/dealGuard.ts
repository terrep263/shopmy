import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateDeal(input: {
  businessName: string
  city: string
  category: string
  price: number
  originalValue: number
}) {

  const prompt = `
  Create a compelling local business deal.

  Business Name: ${input.businessName}
  City: ${input.city}
  Category: ${input.category}
  Deal Price: $${input.price}
  Original Value: $${input.originalValue}

  Return JSON format:
  {
    "title": "",
    "description": "",
    "quality_score": number between 50 and 100
  }
  `

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  })

  const text = completion.choices[0].message.content || "{}"

  try {
    return JSON.parse(text)
  } catch {
    return {
      title: `${input.businessName} Special Offer`,
      description: `Get an exclusive deal at ${input.businessName}.`,
      quality_score: 75
    }
  }
}
