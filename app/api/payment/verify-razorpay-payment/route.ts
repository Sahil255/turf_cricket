import { NextResponse } from 'next/server'
import axios from 'axios'
import crypto from 'crypto'

export async function POST(request: Request) {
  const { order_id, payment_id, signature } = await request.json()

  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? "default_secret_key")
    .update(`${order_id}|${payment_id}`)
    .digest('hex')

  if (generatedSignature === signature) {
    try {
      const response = await axios.get(`https://api.razorpay.com/v1/payments/${payment_id}`, {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
          ).toString('base64')}`,
        },
      })
      return NextResponse.json({ status: response.data.status })
    } catch (error) {
      console.error('Razorpay verification error:', error)
      return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
}