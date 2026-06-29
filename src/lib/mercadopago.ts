import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  options: { timeout: 5000 },
})

export const mpPreference = new Preference(client)
export const mpPayment = new Payment(client)

export interface CreatePreferenceInput {
  orderId: string
  items: Array<{
    id: string
    title: string
    unit_price: number
    quantity: number
    picture_url?: string
  }>
  payer: {
    name: string
    email: string
  }
  externalReference: string
}

export async function createPreference(input: CreatePreferenceInput) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  const response = await mpPreference.create({
    body: {
      items: input.items,
      payer: {
        name: input.payer.name,
        email: input.payer.email,
      },
      external_reference: input.externalReference,
      back_urls: {
        success: `${baseUrl}/checkout/sucesso?orderId=${input.orderId}`,
        failure: `${baseUrl}/checkout/falha?orderId=${input.orderId}`,
        pending: `${baseUrl}/checkout/pendente?orderId=${input.orderId}`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      statement_descriptor: 'WATERMELON ART',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  })

  return response
}

export async function getPaymentInfo(paymentId: string) {
  return mpPayment.get({ id: paymentId })
}

export function mapMPStatusToOrderStatus(mpStatus: string) {
  const map: Record<string, string> = {
    approved: 'PAID',
    pending: 'WAITING_PAYMENT',
    in_process: 'WAITING_PAYMENT',
    rejected: 'CANCELLED',
    cancelled: 'CANCELLED',
    refunded: 'REFUNDED',
    charged_back: 'REFUNDED',
  }
  return map[mpStatus] ?? 'PENDING'
}

export function verifyWebhookSignature(
  xSignature: string,
  xRequestId: string,
  dataId: string,
  secret: string
): boolean {
  const crypto = require('crypto')
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${xSignature.split(',')[0]?.split('=')[1]};`
  const [, v1Part] = xSignature.split(',')
  const receivedHash = v1Part?.split('=')[1]
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(manifest)
  const expectedHash = hmac.digest('hex')
  return expectedHash === receivedHash
}
