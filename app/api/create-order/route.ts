// app/api/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount = 2100 } = await request.json();

    const order = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `hastrekha_${Date.now()}`,
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id 
    });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}