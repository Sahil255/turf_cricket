// app/api/payment/create_razor_pay_order/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { bookingId, amount, customerEmail, customerPhone, customerName } = await request.json()

    // Validate input
    if (!bookingId || !amount || !customerEmail || !customerPhone || !customerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Ensure amount is a number and convert to paise
    const amountInPaise = Math.round(Number(amount) * 100)
    if (isNaN(amountInPaise) || amountInPaise < 100) {
      return NextResponse.json({ error: 'Amount must be at least ₹1' }, { status: 400 })
    }

    // Log payload for debugging
    const payload = {
      amount: 100,
      currency: 'INR',
      receipt: `r_${bookingId}`,
      notes: { bookingId, customerEmail, customerPhone, customerName },
    }
    console.log('Creating Razorpay order with payload:', JSON.stringify(payload, null, 2))

    const response = await axios.post('https://api.razorpay.com/v1/orders', payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
        ).toString('base64')}`,
      },
    })

    return NextResponse.json({
      order_id: response.data.id,
      amount: response.data.amount,
      currency: response.data.currency,
    })
  } catch (error) {
    console.error('Razorpay order creation error:', error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data?.error?.description || 'Failed to create order' },
      { status: error.response?.status || 500 }
    )
  }
}