import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    statusBarStyle: 'black-translucent',
    title: 'Brewrich Wealth',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#06090e',
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
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-['Plus_Jakarta_Sans',sans-serif] antialiased bg-dark-950 text-slate-100 selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
