export interface ModuleStatus {
  id: string;
  user_id: string;
  email: string;
  is_paid: boolean;
  amount_paid?: number;
  currency?: string;
  order_id?: string;
  payment_id?: string;
  signature?: string;
  quiz_1_unlocked: boolean;
  quiz_2_unlocked: boolean;
  quiz_1_score?: number | null;
  quiz_2_score?: number | null;
  created_at: string;
  updated_at: string;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface RazorpayVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  email: string;
}

export interface LiveClassSchedule {
  id: string;
  title: string;
  date: string;
  day: 'Saturday' | 'Sunday';
  time: string;
  duration: string;
  instructor: string;
  meetUrl: string;
  topic: string;
  status: 'upcoming' | 'live' | 'completed';
  tags: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface QuizData {
  id: string;
  title: string;
  module: string;
  description: string;
  passingScore: number;
  timeLimitMinutes: number;
  questions: QuizQuestion[];
}
