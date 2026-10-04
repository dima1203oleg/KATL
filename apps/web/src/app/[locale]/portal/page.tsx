"use client";
import React from 'react';
import { KatlCustomerPortal } from '@/components/KatlCustomerPortal';
import { redirect } from 'next/navigation';

export default function CustomerPortalPage() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-white pt-24">
      <KatlCustomerPortal 
        onNavigate={(pageId) => { console.log("Navigating to", pageId); }}
        onOpenDesignerWithConfig={async (powerKw: number, capacityKwh: number, product: string) => {
          redirect(`/uk-UA/bess-designer?product=${product}&kw=${powerKw}&kwh=${capacityKwh}`);
        }}
        onOpenRfq={() => { console.log("Open RFQ"); }}
      />
    </main>
  );
}
