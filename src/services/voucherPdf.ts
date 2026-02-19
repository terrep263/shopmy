import { PDFDocument } from "pdf-lib"

export async function generateVoucherPDF(voucher: { uuid: string; customer_email: string; expires_at: Date | string }, qrDataUrl: string) {

  const pdfDoc = await PDFDocument.create()

  const page = pdfDoc.addPage([600, 400])

  const { width, height } = page.getSize()

  const expiresText = voucher.expires_at instanceof Date
    ? voucher.expires_at.toLocaleString()
    : new Date(voucher.expires_at).toLocaleString()

  page.drawText("ShopMyNeighborhood Voucher", {
    x: 50,
    y: height - 50,
    size: 20
  })

  page.drawText(`Voucher ID: ${voucher.uuid}`, {
    x: 50,
    y: height - 100,
    size: 12
  })

  page.drawText(`Customer: ${voucher.customer_email}`, {
    x: 50,
    y: height - 130,
    size: 12
  })

  page.drawText(`Expires: ${expiresText}`, {
    x: 50,
    y: height - 160,
    size: 12
  })

  const base64 = qrDataUrl.replace(/^data:image\/\w+;base64,/, "")
  const qrImageBytes = new Uint8Array(Buffer.from(base64, "base64"))
  const qrImage = await pdfDoc.embedPng(qrImageBytes)

  page.drawImage(qrImage, {
    x: 400,
    y: height - 250,
    width: 150,
    height: 150
  })

  const pdfBytes = await pdfDoc.save()

  return pdfBytes
}
