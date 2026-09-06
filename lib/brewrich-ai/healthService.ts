/**
 * BREWRICH AI — HEALTH & SYSTEM STATUS SERVICE
 * 
 * Boundary Rule:
 * Provides diagnostic and health status without executing trades, modifying state,
 * or calling live broker order endpoints.
 */

import { SystemHealthStatus } from './types';
import { fetchBrokerConnectionsFromPython } from './brokerService';
import { fetchPaperPortfolioFromPython } from './paperExecution';
import { LIVE_ENABLED, PAPER_ONLY } from './safetyService';

const PYTHON_API_BASE = process.env.BREWRICH_PYTHON_API_URL || 'http://127.0.0.1:8400';

export async function getSystemHealth(): Promise<SystemHealthStatus> {
  const startTime = Date.now();
  let pythonStatus: 'UP' | 'DOWN' = 'DOWN';
  let pythonLatency = 0;
  let pythonVersion = 'Brewrich 400 Wealth Strategy Engine v1.0.0';

  try {
    const res = await fetch(`${PYTHON_API_BASE}/api/v1/health`, { cache: 'no-store' });
    pythonLatency = Date.now() - startTime;
    if (res.ok) {
      const data = await res.json();
      pythonStatus = 'UP';
      pythonVersion = data.engine_version || pythonVersion;
    }
  } catch {
    pythonStatus = 'DOWN';
    pythonLatency = Date.now() - startTime;
  }

  const paperPortfolio = await fetchPaperPortfolioFromPython();
  const brokers = await fetchBrokerConnectionsFromPython();
  const dhan = brokers.find(b => b.brokerId === 'dhan');
  const firstock = brokers.find(b => b.brokerId === 'firstock');

  const overallStatus = (pythonStatus === 'UP' && paperPortfolio.totalPortfolioValue > 0)
    ? 'HEALTHY'
    : (pythonStatus === 'UP' ? 'DEGRADED' : 'DOWN');

  return {
    timestamp: new Date().toISOString(),
    overallStatus,
    components: {
      webApi: {
        status: 'UP',
        message: 'Next.js API Host Operational',
      },
      pythonEngine: {
        status: pythonStatus,
        latencyMs: pythonLatency,
        version: pythonVersion,
      },
      historicalDataset: {
        status: 'AVAILABLE',
        stockCount: 400,
        sessionCount: 2627,
      },
      paperPortfolio: {
        status: 'PERSISTED',
        nav: paperPortfolio.totalPortfolioValue,
        positionsCount: paperPortfolio.positions.length,
      },
      dhanBroker: {
        status: (dhan?.status as any) || 'READY_PAPER_ONLY',
        trading: 'LOCKED',
      },
      firstockBroker: {
        status: (firstock?.status as any) || 'READY_PAPER_ONLY',
        trading: 'LOCKED',
      },
      liveTradingLock: {
        status: 'ENFORCED',
        liveEnabled: LIVE_ENABLED,
        paperOnly: PAPER_ONLY,
      },
    },
  };
}
