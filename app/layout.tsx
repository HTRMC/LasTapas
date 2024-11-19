// File: app/layout.tsx

import './globals.css';
import { Providers } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Las Tapas',
  description: 'A delightful tapas menu application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics/>
      </body>
    </html>
  );
}