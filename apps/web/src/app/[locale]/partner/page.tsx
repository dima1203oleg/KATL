"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { KatlPartnerPortal } from '../../../components/KatlPartnerPortal';

export default function PartnerPortalPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'uk-UA';

  return (
    <main style={{ minHeight: '100vh', background: '#070a12', color: '#ffffff', paddingTop: 60 }}>
      <KatlPartnerPortal 
        onNavigate={(pageId) => {
          if (pageId === 'home') router.push(`/${locale}`);
          else router.push(`/${locale}/${pageId}`);
        }}
        onOpenRfq={(note?: string) => {
          router.push(`/${locale}/rfq?details=${encodeURIComponent(note || 'Партнерський запит')}`);
        }}
      />
    </main>
  );
}
