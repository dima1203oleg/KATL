"use client";

import React, { useState, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BessDesigner } from '@/components/BessDesigner';
import { BessProposalModal } from '@/components/BessProposalModal';
import { BessBomSolutionModal } from '@/components/BessBomSolutionModal';

export default function BessDesignerPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams?.locale || 'uk-UA';
  const router = useRouter();

  // Modals state
  const [proposalOpen, setProposalOpen] = useState(false);
  const [bomOpen, setBomOpen] = useState(false);
  const [config, setConfig] = useState({
    powerKw: 500,
    capacityKwh: 1000,
    recommendedProduct: 'CATL EnerOne Plus',
    tariffUah: 8.5,
    durationHours: 2,
  });

  const handleApplyToRfq = (summary: string, recommendedProduct: string, powerKw: number, capacityKwh: number) => {
    const params = new URLSearchParams({
      product: recommendedProduct,
      powerKw: String(powerKw),
      capacityKwh: String(capacityKwh),
      durationHours: String(config.durationHours),
      details: summary,
    });
    router.push(`/${locale}/rfq?${params.toString()}`);
  };

  const handleOpenProposal = (powerKw: number, capacityKwh: number, recommendedProduct: string, tariffUah: number) => {
    setConfig((prev) => ({
      ...prev,
      powerKw,
      capacityKwh,
      recommendedProduct,
      tariffUah,
    }));
    setProposalOpen(true);
  };

  const handleOpenBom = (
    powerKw: number,
    capacityKwh: number,
    recommendedProduct: string,
    tariffUah: number,
    durationHours: number
  ) => {
    setConfig({
      powerKw,
      capacityKwh,
      recommendedProduct,
      tariffUah,
      durationHours,
    });
    setBomOpen(true);
  };

  return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, #0d2238 0%, #051322 100%)', color: '#ffffff', paddingTop: 90, paddingBottom: 60 }}>
      <div style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto 36px', padding: '0 20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 999,
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          color: '#34d399',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 16,
        }}>
          CATL Official Sizing Engine
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 14px', color: '#ffffff' }}>
          BESS Designer & Commercial Proposal
        </h1>
        <p style={{ color: '#94a3b8', maxWidth: 680, margin: '0 auto', fontSize: 15, lineHeight: 1.6 }}>
          Професійний інструмент підбору промислових та комерційних систем накопичення енергії CATL.
          Розрахуйте конфігурацію, окупність, сформуйте специфікацію BOM та техніко-комерційну пропозицію (ТКП).
        </p>
      </div>

      <BessDesigner
        onApplyToRfq={handleApplyToRfq}
        onOpenProposal={handleOpenProposal}
        onOpenBom={handleOpenBom}
      />

      <BessProposalModal
        isOpen={proposalOpen}
        onClose={() => setProposalOpen(false)}
        powerKw={config.powerKw}
        capacityKwh={config.capacityKwh}
        recommendedProduct={config.recommendedProduct}
        tariffUah={config.tariffUah}
      />

      <BessBomSolutionModal
        isOpen={bomOpen}
        onClose={() => setBomOpen(false)}
        powerKw={config.powerKw}
        capacityKwh={config.capacityKwh}
        recommendedProduct={config.recommendedProduct}
        tariffUah={config.tariffUah}
        durationHours={config.durationHours}
        onOpenProposal={() => {
          setBomOpen(false);
          setProposalOpen(true);
        }}
      />
    </main>
  );
}
