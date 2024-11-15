// File: app/stations/layout.tsx

import '../globals.css';

export const metadata = {
  title: 'Kitchen Stations - Las Tapas',
  description: 'Kitchen station order management system',
};

export default function StationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}