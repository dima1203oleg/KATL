import React, { useState, useMemo } from 'react';
import { Calculator, Check, ArrowDown, Copy, CheckCheck, Sparkles, Clock, Coins, FileText } from 'lucide-react';
import { Language, EstimatorOptions } from '../types';
import { content } from '../data/content';

interface CostEstimatorSectionProps {
  lang: Language;
  onApplyToBrief: (briefText: string, budgetRange: string, projectType: string) => void;
  selectedServicePreload?: string | null;
}

export const CostEstimatorSection: React.FC<CostEstimatorSectionProps> = ({
  lang,
  onApplyToBrief,
  selectedServicePreload,
}) => {
  const t = content[lang].estimator;

  // Initial mapped states based on preselected service
  const initialType = selectedServicePreload === 'ecommerce' 
    ? 'ecommerce' 
    : selectedServicePreload === 'ui-ux' 
      ? 'corporate' 
      : 'webapp';

  const [projectType, setProjectType] = useState<string>(initialType);
  const [designLevel, setDesignLevel] = useState<string>('custom');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['multilang', 'payment']);
  const [timelineUrgency, setTimelineUrgency] = useState<string>('standard');
  const [currency, setCurrency] = useState<'UAH' | 'USD'>('USD');
  const [copied, setCopied] = useState<boolean>(false);

  // Toggle feature selection
  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  // Calculation logic
  const calculation = useMemo(() => {
    const selectedTypeObj = t.types.find((item) => item.id === projectType) || t.types[0];
    const selectedDesignObj = t.designs.find((item) => item.id === designLevel) || t.designs[1];
    const selectedTimelineObj = t.timelines.find((item) => item.id === timelineUrgency) || t.timelines[1];

    // Base price
    const base = currency === 'UAH' ? selectedTypeObj.basePriceUAH : selectedTypeObj.basePriceUSD;
    
    // Add features price
    const featuresTotal = selectedFeatures.reduce((acc, featId) => {
      const feat = t.featuresList.find((f) => f.id === featId);
      if (!feat) return acc;
      return acc + (currency === 'UAH' ? feat.priceUAH : feat.priceUSD);
    }, 0);

    // Multiplier for design & timeline
    const total = Math.round((base + featuresTotal) * selectedDesignObj.multiplier * selectedTimelineObj.multiplier);

    // Approximate range +/- 10%
    const minPrice = Math.round(total * 0.95);
    const maxPrice = Math.round(total * 1.12);

    // Timeline weeks
    let weeks = selectedTypeObj.baseWeeks + selectedDesignObj.weeksAdd;
    if (selectedFeatures.length > 3) weeks += 1;
    if (timelineUrgency === 'urgent') weeks = Math.max(2, Math.round(weeks * 0.75));

    return {
      minPrice,
      maxPrice,
      weeks,
      typeName: selectedTypeObj.label,
      designName: selectedDesignObj.label,
    };
  }, [projectType, designLevel, selectedFeatures, timelineUrgency, currency, t]);

  const currencySymbol = currency === 'UAH' ? '₴' : '$';

  const formatSummaryText = () => {
    const featureLabels = selectedFeatures
      .map((f) => t.featuresList.find((item) => item.id === f)?.label)
      .filter(Boolean)
      .join(', ');

    return `[OBRIY Estimator]\nТип проєкту: ${calculation.typeName}\nДизайн: ${calculation.designName}\nФункції: ${featureLabels || 'Базові'}\nОрієнтовний бюджет: ${calculation.minPrice.toLocaleString()} - ${calculation.maxPrice.toLocaleString()} ${currencySymbol}\nОрієнтовний термін: ~${calculation.weeks} тижнів`;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(formatSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTransfer = () => {
    const budgetStr = `${calculation.minPrice.toLocaleString()} – ${calculation.maxPrice.toLocaleString()} ${currencySymbol}`;
    onApplyToBrief(formatSummaryText(), budgetStr, calculation.typeName);
  };

  return (
    <section id="estimator" className="py-20 md:py-28 border-b border-white/5 bg-[#0e1017]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {lang === 'ua' ? 'Прозорість & Бюджет' : 'Transparency & Budget'}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              {t.sectionTitle}
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 bg-[#141622] p-1 rounded-lg border border-white/10 self-start md:self-auto">
            <span className="text-xs text-neutral-400 px-2 font-medium">{t.currencySwitch}:</span>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                currency === 'USD' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('UAH')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                currency === 'UAH' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              UAH (₴)
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Configurator on left, Live Sticky Calculation Card on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Project Type */}
            <div className="rounded-xl border border-white/10 bg-[#13151f] p-5 sm:p-6">
              <label className="block text-sm font-bold text-white mb-4">
                {t.projectTypeLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={`text-left p-3.5 rounded-lg border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                      projectType === type.id
                        ? 'border-amber-400 bg-amber-400/10 text-white font-semibold'
                        : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Design Level */}
            <div className="rounded-xl border border-white/10 bg-[#13151f] p-5 sm:p-6">
              <label className="block text-sm font-bold text-white mb-4">
                {t.designLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {t.designs.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setDesignLevel(design.id)}
                    className={`text-left p-3.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      designLevel === design.id
                        ? 'border-amber-400 bg-amber-400/10 text-white font-semibold'
                        : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    {design.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Required Features Checklist */}
            <div className="rounded-xl border border-white/10 bg-[#13151f] p-5 sm:p-6">
              <label className="block text-sm font-bold text-white mb-4">
                {t.featuresLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.featuresList.map((feature) => {
                  const isChecked = selectedFeatures.includes(feature.id);
                  const priceFormatted = currency === 'UAH' ? `+${feature.priceUAH.toLocaleString()} ₴` : `+$${feature.priceUSD}`;

                  return (
                    <div
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'border-amber-400/60 bg-amber-400/10 text-white'
                          : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-4 w-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'border-amber-400 bg-amber-400 text-black'
                              : 'border-neutral-600 bg-transparent'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>{feature.label}</span>
                      </div>
                      <span className="font-mono text-neutral-400 text-[11px] shrink-0 ml-2">
                        {priceFormatted}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Urgency */}
            <div className="rounded-xl border border-white/10 bg-[#13151f] p-5 sm:p-6">
              <label className="block text-sm font-bold text-white mb-3">
                {t.timelineLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {t.timelines.map((tl) => (
                  <button
                    key={tl.id}
                    onClick={() => setTimelineUrgency(tl.id)}
                    className={`text-left p-3.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      timelineUrgency === tl.id
                        ? 'border-amber-400 bg-amber-400/10 text-white font-semibold'
                        : 'border-white/10 bg-white/5 text-neutral-300 hover:border-white/20'
                    }`}
                  >
                    {tl.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Live Sticky Summary Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-amber-400/30 bg-[#151722] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Subtle accent glow */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-amber-400/10 rounded-full blur-2xl -z-10" />

              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-display text-sm font-bold uppercase tracking-wider text-amber-400">
                  {t.summaryTitle}
                </span>
                <span className="text-xs text-neutral-400 font-mono">Live Engine</span>
              </div>

              {/* Price Calculation Output */}
              <div className="mb-6">
                <div className="text-xs text-neutral-400 mb-1 font-medium">
                  {t.summaryRange}
                </div>
                <div className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight tabular-nums">
                  {currencySymbol}{calculation.minPrice.toLocaleString()} – {currencySymbol}{calculation.maxPrice.toLocaleString()}
                </div>
              </div>

              {/* Timeline Output */}
              <div className="mb-6 p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>{t.summaryTime}</span>
                </div>
                <div className="font-mono text-sm font-bold text-amber-300">
                  ~{calculation.weeks} {lang === 'ua' ? 'тижнів' : 'weeks'}
                </div>
              </div>

              {/* Scope Breakdown */}
              <div className="space-y-2 mb-6 text-xs text-neutral-300 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Тип:</span>
                  <span className="font-medium text-white">{calculation.typeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Дизайн:</span>
                  <span className="font-medium text-white">{calculation.designName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Функцій обрано:</span>
                  <span className="font-mono text-amber-300">{selectedFeatures.length}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleTransfer}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-amber-400 py-3 px-4 text-xs sm:text-sm font-bold text-black hover:bg-amber-300 active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <ArrowDown className="h-4 w-4" />
                  <span>{t.transferToBrief}</span>
                </button>

                <button
                  onClick={handleCopySummary}
                  className="w-full flex items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 py-2.5 px-4 text-xs font-medium text-neutral-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-400">{t.copiedSuccess}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>{t.copySummary}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Disclaimer */}
              <p className="mt-5 text-[11px] text-neutral-400 text-center leading-relaxed">
                {t.disclaimer}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
