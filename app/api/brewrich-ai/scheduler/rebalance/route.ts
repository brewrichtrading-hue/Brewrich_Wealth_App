import { NextRequest, NextResponse } from 'next/server';
import { supabaseStore } from '@/lib/brewrich-ai/persistence/supabaseStore';
import { executeWorkerPaperRebalance } from '@/lib/brewrich-ai/workerClient';
import { recordAuditEvent } from '@/lib/brewrich-ai/auditService';
import { LIVE_ENABLED, PAPER_ONLY } from '@/lib/brewrich-ai/safetyService';
import { verifySchedulerAuth } from '@/lib/brewrich-ai/schedulerAuth';

export const dynamic = 'force-dynamic';

function getKolkataDateString(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export async function POST(req: NextRequest) {
  // 1. Fail-closed Safety Invariants
  if (LIVE_ENABLED || !PAPER_ONLY) {
    return NextResponse.json(
      { error: 'CRITICAL SAFETY LOCK: Live trading is strictly disabled.' },
      { status: 403 }
    );
  }

  // 2. Scheduler Authentication
  if (!verifySchedulerAuth(req)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing scheduler bearer token.' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const targetSessionDate: string = body?.sessionDate || req.nextUrl.searchParams.get('sessionDate') || getKolkataDateString();

    // 3. Market Trading Day Check via skyhigh_trading_days (Read-Only)
    const isTradingDay = await supabaseStore.isTradingDay(targetSessionDate);
    if (!isTradingDay) {
      recordAuditEvent({
        category: 'PAPER_EXECUTION',
        action: 'SCHEDULER_MARKET_CHECK_REJECTED',
        details: `Session date ${targetSessionDate} is not a valid NSE trading day in skyhigh_trading_days. Execution skipped.`,
        severity: 'INFO',
        metadata: { session_date: targetSessionDate, is_trading_day: false },
      });

      return NextResponse.json({
        status: 'rejected',
        reason: 'Not a valid NSE trading day in skyhigh_trading_days',
        session_date: targetSessionDate,
        execution_mode: 'PAPER_ONLY',
      });
    }

    // 4. Duplicate Run Prevention: Check if rebalance already recorded in database
    const existingRun = await supabaseStore.getRebalanceRun(targetSessionDate);
    if (existingRun) {
      return NextResponse.json({
        status: 'skipped',
        message: `Paper rebalance already executed for session ${targetSessionDate}`,
        session_date: targetSessionDate,
        run_id: existingRun.id,
        execution_mode: 'PAPER_ONLY',
      });
    }

    // 5. Dispatch Authenticated Rebalance to Persistent Python Worker
    recordAuditEvent({
      category: 'PAPER_EXECUTION',
      action: 'SCHEDULER_REBALANCE_DISPATCH',
      details: `Dispatching scheduled paper rebalance for session ${targetSessionDate} to Python worker.`,
      severity: 'INFO',
      metadata: { session_date: targetSessionDate },
    });

    const workerResult = await executeWorkerPaperRebalance();

    recordAuditEvent({
      category: 'PAPER_EXECUTION',
      action: 'SCHEDULER_REBALANCE_COMPLETED',
      details: `Scheduled paper rebalance returned status: ${workerResult.status}. ${workerResult.message}`,
      severity: workerResult.status === 'success' ? 'SUCCESS' : 'INFO',
      metadata: {
        session_date: targetSessionDate,
        worker_status: workerResult.status,
        actions_count: workerResult.actions_executed?.length || 0,
      },
    });

    return NextResponse.json({
      status: workerResult.status,
      message: workerResult.message,
      session_date: targetSessionDate,
      actions_executed: workerResult.actions_executed || [],
      active_positions: workerResult.active_positions,
      cash_balance: workerResult.cash_balance,
      execution_mode: 'PAPER_ONLY',
    });
  } catch (error: any) {
    recordAuditEvent({
      category: 'PAPER_EXECUTION',
      action: 'SCHEDULER_EXECUTION_ERROR',
      details: `Scheduled rebalance failed: ${error?.message || 'Unknown error'}`,
      severity: 'CRITICAL',
    });

    return NextResponse.json(
      {
        status: 'error',
        error: 'Scheduler execution failed fail-closed.',
        details: error?.message || 'Internal error',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Provide read-only scheduler readiness check
  if (!verifySchedulerAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const todayStr = getKolkataDateString();
  const isTradingDay = await supabaseStore.isTradingDay(todayStr);
  const existingRun = await supabaseStore.getRebalanceRun(todayStr);

  return NextResponse.json({
    service: 'Brewrich AI Scheduler Route',
    status: 'ready_paper_only',
    current_kolkata_date: todayStr,
    is_today_trading_day: isTradingDay,
    rebalance_already_completed: Boolean(existingRun),
    live_trading_locked: true,
    execution_mode: 'PAPER_ONLY',
  });
}
