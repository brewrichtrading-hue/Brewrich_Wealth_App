import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email: payloadEmail,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required Razorpay payment signature parameters.' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'Server payment configuration error: Missing key secret.' },
        { status: 500 }
      );
    }

    // 1. Verify HMAC SHA256 Signature
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error('Invalid payment signature:', {
        generated: generatedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { error: 'Payment verification failed. Invalid signature.' },
        { status: 400 }
      );
    }

    // 2. Identify authenticated user from Supabase session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userEmail = user?.email || payloadEmail;
    const userId = user?.id || null;

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Unable to identify user account associated with this transaction.' },
        { status: 400 }
      );
    }

    // 3. Upsert into Supabase `module_status` table setting is_paid = true
    // First, check if a record already exists for this email or user_id
    const { data: existingRecord } = await supabase
      .from('module_status')
      .select('id')
      .or(userId ? `user_id.eq.${userId},email.eq.${userEmail}` : `email.eq.${userEmail}`)
      .maybeSingle();

    let dbError = null;

    if (existingRecord) {
      const { error } = await supabase
        .from('module_status')
        .update({
          is_paid: true,
          amount_paid: 22000,
          currency: 'INR',
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          quiz_1_unlocked: true, // Auto-unlock first assessment upon enrollment
          updated_at: new Date().toISOString(),
          ...(userId ? { user_id: userId } : {}),
        })
        .eq('id', existingRecord.id);
      dbError = error;
    } else {
      const { error } = await supabase
        .from('module_status')
        .insert({
          user_id: userId,
          email: userEmail,
          is_paid: true,
          amount_paid: 22000,
          currency: 'INR',
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          signature: razorpay_signature,
          quiz_1_unlocked: true,
          quiz_2_unlocked: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      dbError = error;
    }

    if (dbError) {
      console.error('Database update error on payment success:', dbError);
      // Even if DB error, the payment was verified, return status with warning
      return NextResponse.json({
        success: true,
        verified: true,
        db_synced: false,
        message: 'Payment verified successfully. Database record synchronization pending.',
        redirect: '/dashboard',
      });
    }

    return NextResponse.json({
      success: true,
      verified: true,
      db_synced: true,
      message: 'Payment verified and MIIP Institutional access granted.',
      redirect: '/dashboard',
    });
  } catch (error: any) {
    console.error('Error during payment verification:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during verification.' },
      { status: 500 }
    );
  }
}
