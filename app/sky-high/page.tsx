import type { Metadata } from 'next';
import BrewrichAiShell from '@/components/brewrich-ai/BrewrichAiShell';

export const metadata: Metadata = {
  title: 'Brewrich AI | Personal Wealth Cockpit',
  description:
    'Private quantitative wealth cockpit operating the proprietary Brewrich 400 momentum strategy engine.',
  keywords: [
    'Brewrich AI',
    'Personal Wealth Cockpit',
    'Brewrich 400',
    'Quantitative Momentum',
    'Paper Trading',
    'Dhan',
    'Firstock',
  ],
};

export default function Page() {
  return <BrewrichAiShell />;
}
