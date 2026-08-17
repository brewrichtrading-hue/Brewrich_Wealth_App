import { NextResponse } from 'next/server';
import { razorpayInstance } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json().catch(() => ({}));
    const email = user?.email || body.email;

    if (!email) {
      return NextResponse.json(
        { error: 'Email or authentication is required to initiate registration.' },
        { status: 400 }
      );
    }

    // MIIP Program Fee: ₹22,000 INR (amount in paise = 22000 * 100 = 2200000)
    const amountInPaise = 22000 * 100;
    const receiptId = `miip_rcpt_${Date.now().toString().slice(-8)}_${Math.random().toString(36).substring(2, 6)}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        program: 'Momentum Institutional Investing Program (MIIP)',
        email: email,
        userId: user?.id || 'anonymous_pre_auth',
      },
    };

    const order = await razorpayInstance.orders.create(options);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to initialize payment gateway order.',
      },
      { status: 500 }
    );
  }
}
