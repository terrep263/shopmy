import QRCode from "qrcode"

export async function generateQRCode(data: string) {

  return await QRCode.toDataURL(data)
}
