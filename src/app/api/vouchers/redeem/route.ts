import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { uuid } = body

    if (!uuid)
      return new Response(JSON.stringify({
        valid: false,
        reason: "Voucher UUID required"
      }), { status: 400, headers: { "Content-Type": "application/json" } })

    const voucher = await prisma.voucher.findUnique({
      where: { uuid }
    })

    if (!voucher)
      return new Response(JSON.stringify({
        valid: false,
        reason: "Voucher not found"
      }), { status: 200, headers: { "Content-Type": "application/json" } })

    if (voucher.status === "redeemed")
      return new Response(JSON.stringify({
        valid: false,
        reason: "Already redeemed"
      }), { status: 200, headers: { "Content-Type": "application/json" } })

    if (new Date() > voucher.expires_at)
      return new Response(JSON.stringify({
        valid: false,
        reason: "Expired"
      }), { status: 200, headers: { "Content-Type": "application/json" } })

    await prisma.$transaction([
      prisma.voucher.update({
        where: { uuid },
        data: { status: "redeemed" }
      }),
      prisma.voucherRedemption.create({
        data: {
          voucher_id: voucher.id,
          redeemed_by_vendor: "scanner"
        }
      })
    ])

    return new Response(JSON.stringify({
      valid: true
    }), { status: 200, headers: { "Content-Type": "application/json" } })

  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({
      valid: false,
      reason: "Redemption failed"
    }), { status: 500, headers: { "Content-Type": "application/json" } })
  }
}
