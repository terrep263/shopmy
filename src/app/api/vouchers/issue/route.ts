import { prisma } from "@/lib/prisma"
import { generateQRCode } from "@/services/qrCode"
import { generateVoucherPDF } from "@/services/voucherPdf"
import crypto from "crypto"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const {
      dealId,
      customerEmail,
      callbackSecret
    } = body

    if (callbackSecret !== process.env.PAYMENT_CALLBACK_SECRET)
      return new Response(JSON.stringify({
        error: "Invalid callback secret"
      }), { status: 403, headers: { "Content-Type": "application/json" } })

    if (!dealId || !customerEmail)
      return new Response(JSON.stringify({
        error: "dealId and customerEmail required"
      }), { status: 400, headers: { "Content-Type": "application/json" } })

    const deal = await prisma.deal.findUnique({
      where: { id: dealId }
    })

    if (!deal)
      return new Response(JSON.stringify({
        error: "Deal not found"
      }), { status: 404, headers: { "Content-Type": "application/json" } })

    const uuid = crypto.randomUUID()

    const voucher = await prisma.voucher.create({
      data: {
        deal_id: dealId,
        uuid,
        customer_email: customerEmail,
        status: "issued",
        expires_at: deal.expiration_date
      }
    })

    const qrDataUrl = await generateQRCode(uuid)

    const pdfBytes = await generateVoucherPDF(voucher, qrDataUrl)

    return new Response(pdfBytes as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=voucher-${uuid}.pdf`
      }
    })

  } catch (err) {

    console.error(err)

    return new Response(JSON.stringify({
      error: "Voucher creation failed"
    }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
