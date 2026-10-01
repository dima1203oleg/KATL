/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { KatlNavbar, KatlPage } from './components/katl/KatlNavbar';
import { KatlHomePage } from './components/katl/KatlHomePage';
import { KatlCatalogPage } from './components/katl/KatlCatalogPage';
import { KatlProductDetailPage } from './components/katl/KatlProductDetailPage';
import { KatlComparePage } from './components/katl/KatlComparePage';
import { KatlSolutionsPage } from './components/katl/KatlSolutionsPage';
import { KatlIndustriesPage } from './components/katl/KatlIndustriesPage';
import { KatlTechnologySafetyPage } from './components/katl/KatlTechnologySafetyPage';
import { KatlTechPage } from './components/katl/KatlTechPage';
import { KatlPartnerPortal } from './components/katl/KatlPartnerPortal';
import { KatlCustomerPortal } from './components/katl/KatlCustomerPortal';
import { KatlAdminPortal } from './components/katl/KatlAdminPortal';
import { KatlFooter } from './components/katl/KatlFooter';
import { KatlVideoModal } from './components/katl/KatlVideoModal';
import { KatlSearchModal } from './components/katl/KatlSearchModal';
import { KatlAiAdvisorModal } from './components/katl/KatlAiAdvisorModal';
import { KatlPageRegistryModal } from './components/katl/KatlPageRegistryModal';
import { KatlRfqModal } from './components/katl/KatlRfqModal';
import { BessBomSolutionModal } from './components/BessBomSolutionModal';
import { BessProposalModal } from './components/BessProposalModal';
import { EngineerReviewWorkspaceModal } from './components/EngineerReviewWorkspaceModal';
import { SeoCommandCenterModal } from './components/SeoCommandCenterModal';
import { Toast } from './components/Toast';
import { useAppRouter } from './router/useAppRouter';
import { computeSeoMetadata, applySeoToDocument } from './lib/seoManager';

export default function App() {
  const { route, navigateTo } = useAppRouter();
  const currentPage = route.page;
  const selectedProductId = route.productId;
  const compareProductIds = route.compareProductIds;

  // Dynamic SEO metadata updates on route transition
  React.useEffect(() => {
    const seo = computeSeoMetadata(route);
    applySeoToDocument(seo);
  }, [route]);

  // Modals state
  const [isRfqOpen, setIsRfqOpen] = useState(route.isRfqRoute);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isBomOpen, setIsBomOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isSeoCenterOpen, setIsSeoCenterOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Configuration state for BOM & Proposal
  const [currentConfig, setCurrentConfig] = useState({
    powerKw: 1200,
    capacityKwh: 2400,
    recommendedProduct: 'CATL TENER H (9.008 МВт·год)',
    tariffUah: 8.5,
    durationHours: 2,
  });

  // Cross-component RFQ data
  const [rfqData, setRfqData] = useState<{
    product: string;
    summary: string;
    powerKw?: number;
    capacityKwh?: number;
  }>({
    product: 'CATL TENER H',
    summary: 'Запит комерційної пропозиції для проекту промислового накопичувача енергії',
    powerKw: 1200,
    capacityKwh: 2400,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const handleNavigate = (page: KatlPage) => {
    navigateTo({ page });
  };

  const handleSelectProduct = (productId: string) => {
    navigateTo({ page: 'product', productId });
  };

  const handleToggleCompare = (id: string) => {
    const updated = compareProductIds.includes(id)
      ? compareProductIds.length > 1 ? compareProductIds.filter((p) => p !== id) : compareProductIds
      : compareProductIds.length < 4 ? [...compareProductIds, id] : compareProductIds;
    navigateTo({ page: 'compare', compareProductIds: updated });
  };

  const handleOpenRfq = (note?: string) => {
    if (note) {
      setRfqData((prev) => ({
        ...prev,
        summary: note,
        product: note.includes('TENER')
          ? 'CATL TENER H'
          : note.includes('EnerOne')
          ? 'CATL EnerOne Plus'
          : prev.product,
      }));
    }
    setIsRfqOpen(true);
    showToast('Форму комерційного запиту відкрито');
  };

  const handleOpenBom = () => {
    setIsBomOpen(true);
    showToast('Специфікацію BOM відкрито');
  };

  const handleOpenProposal = () => {
    setIsProposalOpen(true);
    showToast('Попереднє комерційне ТКП згенеровано');
  };

  const handleOpenDesigner = () => {
    handleNavigate('home');
    setTimeout(() => {
      const el = document.getElementById('bess-designer-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleApplyAiToDesigner = (powerKw: number, capacityKwh: number, product: string) => {
    setCurrentConfig((prev) => ({
      ...prev,
      powerKw,
      capacityKwh,
      recommendedProduct: product,
    }));
    showToast(`Параметри ${powerKw} кВт / ${capacityKwh} кВт·год передано в BESS Designer`);
    handleOpenDesigner();
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* 1. Header / Navbar matching exact photo design */}
      <KatlNavbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenRfq={() => handleOpenRfq('Запит з головного меню сайту')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenRegistry={() => setIsRegistryOpen(true)}
        onOpenDesigner={handleOpenDesigner}
      />

      {/* 2. Main Page Content View */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <KatlHomePage
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
            onSelectProduct={handleSelectProduct}
            onOpenVideo={() => setIsVideoOpen(true)}
            onOpenBom={handleOpenBom}
            onOpenProposal={handleOpenProposal}
          />
        )}

        {currentPage === 'catalog' && (
          <KatlCatalogPage
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
            onSelectProduct={handleSelectProduct}
            compareProductIds={compareProductIds}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {currentPage === 'product' && (
          <KatlProductDetailPage
            productId={selectedProductId}
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
            onSelectProduct={handleSelectProduct}
            onOpenVideo={() => setIsVideoOpen(true)}
          />
        )}

        {currentPage === 'compare' && (
          <KatlComparePage
            selectedProductIds={compareProductIds}
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'solutions' && (
          <KatlSolutionsPage
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'industries' && (
          <KatlIndustriesPage
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'safety' && (
          <KatlTechnologySafetyPage
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
          />
        )}

        {currentPage === 'tech' && (
          <KatlTechPage
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
          />
        )}

        {currentPage === 'partners' && (
          <KatlPartnerPortal
            onNavigate={handleNavigate}
            onOpenRfq={handleOpenRfq}
          />
        )}

        {currentPage === 'customer' && (
          <KatlCustomerPortal
            onNavigate={handleNavigate}
            onOpenDesignerWithConfig={(powerKw, capacityKwh, product) => {
              setCurrentConfig((prev) => ({ ...prev, powerKw, capacityKwh, recommendedProduct: product }));
              handleOpenDesigner();
            }}
            onOpenRfq={handleOpenRfq}
          />
        )}

        {currentPage === 'admin' && (
          <KatlAdminPortal
            onNavigate={handleNavigate}
            onOpenSeoCenter={() => setIsSeoCenterOpen(true)}
          />
        )}
      </main>

      {/* 3. Footer matching exact photo layout & TITAN spec */}
      <KatlFooter
        onNavigate={handleNavigate}
        onOpenRfq={() => handleOpenRfq('Запит з футера сайту')}
        onOpenSeoCenter={() => setIsSeoCenterOpen(true)}
        onOpenRegistry={() => setIsRegistryOpen(true)}
      />

      {/* --- Interactive Overlays & Modals --- */}

      {/* RFQ Commercial Proposal Modal */}
      <KatlRfqModal
        isOpen={isRfqOpen}
        onClose={() => setIsRfqOpen(false)}
        prefilledProduct={rfqData.product}
        prefilledSummary={rfqData.summary}
        prefilledPowerKw={rfqData.powerKw}
        prefilledCapacityKwh={rfqData.capacityKwh}
      />

      {/* Video Player Modal (2 min) */}
      <KatlVideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="CATL TENER: Офіційний огляд технологій нульової деградації та безпеки"
      />

      {/* Instant Search Modal */}
      <KatlSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        onOpenRfq={handleOpenRfq}
        onSelectProduct={handleSelectProduct}
      />

      {/* AI Energy Advisor Modal (Chat + Sizing Transfer) */}
      <KatlAiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        onApplyToDesigner={handleApplyAiToDesigner}
        onApplyToRfq={(summary, product) => {
          handleOpenRfq(summary);
        }}
      />

      {/* TITAN Page Registry & Route Governance Audit Modal */}
      <KatlPageRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Bill of Materials (BOM) & Equipment Architecture Modal */}
      <BessBomSolutionModal
        isOpen={isBomOpen}
        onClose={() => setIsBomOpen(false)}
        powerKw={currentConfig.powerKw}
        capacityKwh={currentConfig.capacityKwh}
        recommendedProduct={currentConfig.recommendedProduct}
        tariffUah={currentConfig.tariffUah}
        durationHours={currentConfig.durationHours}
        onOpenProposal={handleOpenProposal}
      />

      {/* Official Branded Technical-Commercial Proposal (TKP) Generator Modal */}
      <BessProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        powerKw={currentConfig.powerKw}
        capacityKwh={currentConfig.capacityKwh}
        recommendedProduct={currentConfig.recommendedProduct}
        tariffUah={currentConfig.tariffUah}
      />

      {/* Engineering Review & Sales Intelligence Workspace Modal */}
      <EngineerReviewWorkspaceModal
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
      />

      {/* SEO Command Center & Semantic Core Audit Modal */}
      <SeoCommandCenterModal
        isOpen={isSeoCenterOpen}
        onClose={() => setIsSeoCenterOpen(false)}
      />

      {/* Floating System Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
