import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlobalScrollUnlocker from '@/components/GlobalScrollUnlocker';

export const metadata: Metadata = {
  title: 'Brewrich Wealth | Institutional Wealth & Momentum Trading Firm',
  description:
    'Empowering investors with institutional quantitative momentum models, mutual fund wealth distribution, and elite trading mentorship.',
  keywords: [
    'wealth management',
    'mutual fund distribution',
    'momentum trading',
    'institutional trading',
    'AMFI registered',
    'MIIP program',
    'order flow trading',
  ],
  authors: [{ name: 'Brewrich Wealth Management' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Brewrich Wealth',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A358F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-slate-50">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
        <GlobalScrollUnlocker />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
