import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'CATL BESS Ukraine — Промислові накопичувачі енергії',
  description:
    'Офіційна інженерна платформа промислових систем накопичення енергії (BESS / ESS) CATL в Україні: CATL TENER, EnerOne, конфігуратор потужності та розрахунок ROI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#080d19] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
