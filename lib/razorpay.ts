import Razorpay from 'razorpay';

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
  console.warn('Missing NEXT_PUBLIC_RAZORPAY_KEY_ID in environment variables');
}

if (!process.env.RAZORPAY_KEY_SECRET) {
  console.warn('Missing RAZORPAY_KEY_SECRET in environment variables');
}

export const razorpayInstance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
