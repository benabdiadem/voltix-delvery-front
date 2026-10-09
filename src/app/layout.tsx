import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Voltix Delivery — Campus Operations',
  description: 'Campus Multi-Shop Delivery Platform Administration & Operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

