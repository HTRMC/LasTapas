// File: app/layout.tsx

import './globals.css';
import { Providers } from './providers';

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
      </body>
    </html>
  );
}