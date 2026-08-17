import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId, score } = await request.json();

    if (!quizId || typeof score !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (quizId === 'quiz-1') {
      updatePayload.quiz_1_score = score;
      // If student passes Quiz 1 (>=80%), automatically unlock Quiz 2
      if (score >= 80) {
        updatePayload.quiz_2_unlocked = true;
      }
    } else if (quizId === 'quiz-2') {
      updatePayload.quiz_2_score = score;
    }

    // Upsert or update module_status
    const { error: updateError } = await supabase
      .from('module_status')
      .update(updatePayload)
      .or(`user_id.eq.${user.id},email.eq.${user.email}`);

    if (updateError) {
      console.error('Error updating quiz score:', updateError);
      return NextResponse.json(
        { error: 'Failed to persist assessment results' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quizId,
      score,
      unlockedNext: quizId === 'quiz-1' && score >= 80,
    });
  } catch (error: any) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
