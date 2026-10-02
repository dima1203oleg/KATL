import type { Metadata, Viewport } from 'next';
import React from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_SITE_URL || 'https://catl.site'),
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function LocaleNegotiationLayout({ children }: { children: React.ReactNode }) {
  return <html lang="uk-UA"><body>{children}</body></html>;
}
