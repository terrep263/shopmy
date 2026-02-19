export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      dealId,
      customerEmail
    } = body

    if (!dealId || !customerEmail)
      return new Response(JSON.stringify({
        error: "dealId and customerEmail required"
      }), { status: 400, headers: { "Content-Type": "application/json" } })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const issueResponse = await fetch(
      `${baseUrl}/api/vouchers/issue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dealId,
          customerEmail,
          callbackSecret: process.env.PAYMENT_CALLBACK_SECRET
        })
      }
    )

    if (!issueResponse.ok) {
      const err = await issueResponse.json().catch(() => ({}))
      return new Response(JSON.stringify({
        error: err.error || "Voucher creation failed"
      }), { status: issueResponse.status, headers: { "Content-Type": "application/json" } })
    }

    const pdf = await issueResponse.arrayBuffer()

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=voucher.pdf"
      }
    })

  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({
      error: "Purchase failed"
    }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
