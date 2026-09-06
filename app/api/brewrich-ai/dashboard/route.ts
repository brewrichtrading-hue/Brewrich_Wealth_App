import { NextResponse } from 'next/server';
import { getBrewrich400StateAsync } from '@/lib/brewrich-ai/brewrich400Engine';
import { fetchPaperPortfolioFromPython, fetchPaperOrdersFromPython } from '@/lib/brewrich-ai/paperExecution';
import { getRiskSafetyMetrics, fetchBrokerConnectionsFromPython, fetchAuditLogsFromPython } from '@/lib/brewrich-ai/brokerService';
import { CockpitDashboardData } from '@/lib/brewrich-ai/types';

export async function GET() {
  try {
    const [strategy, portfolio, recentOrdersAll, brokers, recentAuditLogsAll] = await Promise.all([
      getBrewrich400StateAsync(),
      fetchPaperPortfolioFromPython(),
      fetchPaperOrdersFromPython(),
      fetchBrokerConnectionsFromPython(),
      fetchAuditLogsFromPython(),
    ]);

    const recentOrders = recentOrdersAll.slice(0, 5);
    const risk = getRiskSafetyMetrics();
    const recentAuditLogs = recentAuditLogsAll.slice(0, 5);

    const data: CockpitDashboardData = {
      systemPulse: 'OPERATIONAL',
      strategy,
      portfolio,
      recentOrders,
      risk,
      brokers,
      recentAuditLogs,
      liveStatus: {
        isLocked: true,
        reason: 'Execution mode is strictly PAPER. Live trading is fail-closed locked.',
      },
    };

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to load cockpit data.' }, { status: 500 });
  }
}

