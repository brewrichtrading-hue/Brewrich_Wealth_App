import type { Metadata } from 'next';
import SkyHighPage from '@/components/SkyHighPage';

export const metadata: Metadata = {
  title: 'Brewrich Sky High | Blue Sky Strategy Engine',
  description:
    'A focused NSE strategy engine for screening, backtesting and eventually live execution.',
  keywords: [
    'Brewrich Sky High',
    'Blue Sky Strategy',
    'NSE Data Engine',
    'Quantitative Momentum',
    'Stock Screening',
    'Backtesting',
  ],
};

export default function Page() {
  return <SkyHighPage />;
}
