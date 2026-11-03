import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: 'OneBid Ethiopia | Lowest Unique Bid Wins Cash, Cars & Tech',
  description:
    'Ethiopia’s premier lowest unique bid auction platform. Win cash drops, brand-new zero-KM cars, and flagship tech for the lowest unmatched numeric bid.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

