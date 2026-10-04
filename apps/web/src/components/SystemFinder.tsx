'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Home, 
  Factory, 
  Zap, 
  Sun, 
  BatteryCharging, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Calculator,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemFinderProps {
  locale: string;
}

export function SystemFinder({ locale }: SystemFinderProps) {
  const isEn = locale === 'en';
  const isZh = locale === 'zh-CN';

  // Wizard state
  const [segment, setSegment] = useState<'residential' | 'commercial' | 'industrial' | 'utility'>('commercial');
  const [powerKw, setPowerKw] = useState<number>(200);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [solarStatus, setSolarStatus] = useState<'existing' | 'planned' | 'none'>('existing');

  // Recommendation engine
  const calculation = useMemo(() => {
    const rawCapacity = powerKw * durationHours;
    // Buffer for depth of discharge (90% usable) and round-trip efficiency
    const recommendedCapacityKwh = Math.round(rawCapacity * 1.12);

    let recommendedProductId = 'catl-enerone-plus';
    let recommendedProductName = 'CATL EnerOne Plus';
    let recommendedCategory = isEn ? 'Outdoor Battery Cabinet' : isZh ? '户外电池柜' : 'Батарейна шафа';
    let startingPriceText = isEn ? 'from 4,100,000 UAH' : isZh ? '4,100,000 乌克兰格里夫纳起' : 'від 4 100 000 грн';
    let batteryUnits = 1;

    if (segment === 'residential' || rawCapacity <= 35) {
      if (rawCapacity <= 15) {
        recommendedProductId = 'catl-residential-pr15';
        recommendedProductName = 'CATL Residential PR-15';
        recommendedCategory = isEn ? 'Home ESS' : isZh ? '家用储能' : 'Домашня система';
        startingPriceText = isEn ? 'from 260,000 UAH' : isZh ? '260,000 乌克兰格里夫纳起' : 'від 260 000 грн';
        batteryUnits = 1;
      } else {
        recommendedProductId = 'catl-residential-pr30';
        recommendedProductName = 'CATL Residential PR-30';
        recommendedCategory = isEn ? 'Home High-Capacity ESS' : isZh ? '家用大容量储能' : 'Домашня система';
        startingPriceText = isEn ? 'from 480,000 UAH' : isZh ? '480,000 乌克兰格里夫纳起' : 'від 480 000 грн';
        batteryUnits = 1;
      }
    } else if (rawCapacity <= 500) {
      recommendedProductId = 'catl-enerone-plus';
      recommendedProductName = 'CATL EnerOne Plus (418.5 kWh)';
      recommendedCategory = isEn ? 'C&I Outdoor Cabinet' : isZh ? '工商业户外储能柜' : 'Батарейна шафа C&I';
      startingPriceText = isEn ? 'from 4,100,000 UAH' : isZh ? '4,100,000 乌克兰格里夫纳起' : 'від 4 100 000 грн';
      batteryUnits = Math.max(1, Math.ceil(recommendedCapacityKwh / 400));
    } else if (rawCapacity <= 2200) {
      recommendedProductId = 'catl-unic-1000';
      recommendedProductName = 'CATL UniC 1.0 MW / 2.0 MWh';
      recommendedCategory = isEn ? 'Commercial & Industrial ESS' : isZh ? '一体化工商业储能' : 'Комерційна BESS';
      startingPriceText = isEn ? 'from 14,500,000 UAH' : isZh ? '14,500,000 乌克兰格里夫纳起' : 'від 14 500 000 грн';
      batteryUnits = Math.max(1, Math.ceil(recommendedCapacityKwh / 2000));
    } else {
      recommendedProductId = 'catl-tener-6250';
      recommendedProductName = 'CATL TENER 6.25 MWh';
      recommendedCategory = isEn ? 'Utility-Scale Container BESS' : isZh ? '公用事业级集装箱储能' : 'Великі контейнерні BESS';
      startingPriceText = isEn ? 'from 42,000,000 UAH' : isZh ? '42,000,000 乌克兰格里夫纳起' : 'від 42 000 000 грн';
      batteryUnits = Math.max(1, Math.ceil(recommendedCapacityKwh / 6250));
    }

    return {
      rawCapacity,
      recommendedCapacityKwh,
      recommendedProductId,
      recommendedProductName,
      recommendedCategory,
      startingPriceText,
      batteryUnits
    };
  }, [segment, powerKw, durationHours, isEn, isZh]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="finder-card-section" 
      id="system-finder"
    >
      <div className="finder-header">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="finder-badge"
        >
          <Sparkles size={14} />
          <span>{isEn ? 'CATL SYSTEM SELECTOR' : isZh ? 'CATL 系统选型助手' : 'ЗНАЙДІТЬ СВОЮ СИСТЕМУ'}</span>
        </motion.div>
        <h2>{isEn ? 'Calculate your CATL Energy Storage System' : isZh ? '智能选型：计算专属 CATL 储能方案' : 'Розрахуйте вашу систему накопичення енергії'}</h2>
        <p>
          {isEn 
            ? 'Answer 4 basic questions about your facility to receive an optimal CATL configuration, preliminary equipment sizing, and estimated pricing.' 
            : isZh 
            ? '回答关于您设施的 4 个基础问题，即可获得最优 CATL 设备配置、容量测算与预算参考。' 
            : 'Дайте відповіді на 4 запитання щодо вашого об’єкта, щоб отримати орієнтовну конфігурацію, рекомендовану модель CATL та бюджетну оцінку.'}
        </p>
      </div>

      <div className="finder-grid">
        {/* Left Interactive Input Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="finder-controls"
        >
          {/* Step 1: Sector / Segment */}
          <div className="finder-step">
            <label className="step-label">
              <span className="step-number">01</span>
              {isEn ? 'Application scenario' : isZh ? '应用场景 / 设施类型' : 'Для чого потрібна система?'}
            </label>
            <div className="segment-pills">
              <button
                type="button"
                className={`segment-btn ${segment === 'residential' ? 'active' : ''}`}
                onClick={() => { setSegment('residential'); if (powerKw > 30) setPowerKw(15); }}
              >
                <Home size={17} />
                <span>{isEn ? 'Home / Villa' : isZh ? '家用 / 别墅' : 'Для дому'}</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${segment === 'commercial' ? 'active' : ''}`}
                onClick={() => { setSegment('commercial'); if (powerKw < 50 || powerKw > 500) setPowerKw(200); }}
              >
                <Building2 size={17} />
                <span>{isEn ? 'Commercial' : isZh ? '商业 / 办公楼' : 'Для бізнесу'}</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${segment === 'industrial' ? 'active' : ''}`}
                onClick={() => { setSegment('industrial'); if (powerKw < 250 || powerKw > 2000) setPowerKw(1000); }}
              >
                <Factory size={17} />
                <span>{isEn ? 'Industrial' : isZh ? '工业 / 制造业' : 'Для промисловості'}</span>
              </button>
              <button
                type="button"
                className={`segment-btn ${segment === 'utility' ? 'active' : ''}`}
                onClick={() => { setSegment('utility'); if (powerKw < 1000) setPowerKw(3125); }}
              >
                <Zap size={17} />
                <span>{isEn ? 'Grid / Utility' : isZh ? '电网 / 大型基础设施' : 'Великі BESS'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Power Demand */}
          <div className="finder-step">
            <div className="step-label-row">
              <label className="step-label">
                <span className="step-number">02</span>
                {isEn ? 'Required power' : isZh ? '所需功率' : 'Яка потужність навантаження?'}
              </label>
              <span className="current-value">
                {powerKw >= 1000 ? `${(powerKw / 1000).toFixed(2)} МВт` : `${powerKw} кВт`}
              </span>
            </div>
            <div className="range-wrap">
              <input
                type="range"
                min={segment === 'residential' ? 5 : segment === 'commercial' ? 50 : segment === 'industrial' ? 200 : 1000}
                max={segment === 'residential' ? 30 : segment === 'commercial' ? 600 : segment === 'industrial' ? 3000 : 10000}
                step={segment === 'residential' ? 5 : segment === 'commercial' ? 25 : segment === 'industrial' ? 100 : 250}
                value={powerKw}
                onChange={(e) => setPowerKw(Number(e.target.value))}
                className="finder-range"
              />
              <div className="range-markers">
                <span>{segment === 'residential' ? '5 кВт' : segment === 'commercial' ? '50 кВт' : segment === 'industrial' ? '200 кВт' : '1 МВт'}</span>
                <span>{segment === 'residential' ? '30 кВт' : segment === 'commercial' ? '600 кВт' : segment === 'industrial' ? '3 МВт' : '10 МВт'}</span>
              </div>
            </div>
          </div>

          {/* Step 3: Backup Duration */}
          <div className="finder-step">
            <label className="step-label">
              <span className="step-number">03</span>
              {isEn ? 'Desired backup duration' : isZh ? '期望备用放电时长' : 'Скільки годин резерву?'}
            </label>
            <div className="duration-options">
              {[2, 4, 6].map((hours) => (
                <button
                  key={hours}
                  type="button"
                  className={`duration-btn ${durationHours === hours ? 'active' : ''}`}
                  onClick={() => setDurationHours(hours)}
                >
                  <strong>{hours} {isEn ? 'hours' : isZh ? '小时' : 'год'}</strong>
                  <small>
                    {hours === 2 
                      ? (isEn ? 'Peak shaving & fast arbitrage' : isZh ? '削峰与常规套利' : 'Зрізання піків / 0.5C')
                      : hours === 4 
                      ? (isEn ? 'Deep night reserve' : isZh ? '深度储能与夜间备用' : 'Глибокий резерв / нічний тариф')
                      : (isEn ? 'Full blackout autonomy' : isZh ? '超长断电自主运行' : 'Максимальна автономність')}
                  </small>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Solar Generation */}
          <div className="finder-step">
            <label className="step-label">
              <span className="step-number">04</span>
              {isEn ? 'Solar PV availability' : isZh ? '是否配置光伏' : 'Чи є сонячна генерація (СЕС)?'}
            </label>
            <div className="solar-pills">
              <button
                type="button"
                className={`solar-btn ${solarStatus === 'existing' ? 'active' : ''}`}
                onClick={() => setSolarStatus('existing')}
              >
                <Sun size={15} />
                <span>{isEn ? 'Yes, existing PV' : isZh ? '已有光伏系统' : 'Так, діюча СЕС'}</span>
              </button>
              <button
                type="button"
                className={`solar-btn ${solarStatus === 'planned' ? 'active' : ''}`}
                onClick={() => setSolarStatus('planned')}
              >
                <Sparkles size={15} />
                <span>{isEn ? 'Planned with BESS' : isZh ? '计划同时建设' : 'Планується з BESS'}</span>
              </button>
              <button
                type="button"
                className={`solar-btn ${solarStatus === 'none' ? 'active' : ''}`}
                onClick={() => setSolarStatus('none')}
              >
                <Zap size={15} />
                <span>{isEn ? 'Grid-only' : isZh ? '仅电网供电' : 'Лише мережа'}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Dynamic Recommendation Result */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="finder-result-card"
        >
          <div className="result-kicker">
            <ShieldCheck size={16} />
            <span>{isEn ? 'RECOMMENDED CONFIGURATION' : isZh ? '推荐工程配置方案' : 'РЕКОМЕНДОВАНА КОНФІГУРАЦІЯ'}</span>
          </div>

          <div className="result-product-hero">
            <span className="result-category">{calculation.recommendedCategory}</span>
            <h3 className="result-name">{calculation.recommendedProductName}</h3>
            <p className="result-summary">
              {isEn 
                ? `System dimensioned for ${powerKw} kW peak load and ${durationHours} hours continuous discharge autonomy.`
                : isZh
                ? `该方案满足 ${powerKw} kW 峰值功率与 ${durationHours} 小时连续放电需求。`
                : `Система розрахована на навантаження ${powerKw} кВт та ${durationHours} год гарантованої роботи без електромережі.`}
            </p>
          </div>

          <div className="result-specs-grid">
            <div className="spec-box">
              <small>{isEn ? 'Recommended Capacity' : isZh ? '推荐储能容量' : 'Рекомендована ємність'}</small>
              <strong>
                {calculation.recommendedCapacityKwh >= 1000 
                  ? `${(calculation.recommendedCapacityKwh / 1000).toFixed(2)} МВт·год`
                  : `${calculation.recommendedCapacityKwh} кВт·год`}
              </strong>
            </div>
            <div className="spec-box">
              <small>{isEn ? 'Inverter / PCS Power' : isZh ? '推荐变流功率 (PCS)' : 'Рекомендована потужність'}</small>
              <strong>
                {powerKw >= 1000 ? `${(powerKw / 1000).toFixed(2)} МВт` : `${powerKw} кВт`}
              </strong>
            </div>
            <div className="spec-box">
              <small>{isEn ? 'Approximate Units' : isZh ? '设备台数' : 'Кількість блоків / шаф'}</small>
              <strong>{calculation.batteryUnits} {isEn ? 'unit(s)' : isZh ? '台' : 'од.'}</strong>
            </div>
            <div className="spec-box">
              <small>{isEn ? 'Cycle Life' : isZh ? '循环寿命' : 'Ресурс осередків LFP'}</small>
              <strong>10 000+ {isEn ? 'cycles' : isZh ? '次' : 'циклів'}</strong>
            </div>
          </div>

          <div className="result-pricing-box">
            <div className="price-tag">
              <span className="price-sub">{isEn ? 'Estimated equipment cost:' : isZh ? '预估设备价格：' : 'Орієнтовна вартість:'}</span>
              <strong className="price-val">{calculation.startingPriceText}</strong>
            </div>
            <p className="price-disclaimer">
              {isEn 
                ? 'Final price depends on system configuration, transformer station, and engineering integration.'
                : isZh
                ? '最终价格取决于系统最终配置、变压器与现场电气集成方案。'
                : 'Фінальна ціна залежить від конфігурації системи, трансформатора та умов інтеграції.'}
            </p>
          </div>

          <div className="result-actions">
            <Link 
              href={`/${locale}/rfq?powerKw=${powerKw}&capacityKwh=${calculation.recommendedCapacityKwh}&product=${calculation.recommendedProductId}&scenario=${segment}`}
              className="button button-primary-accent"
            >
              <span>{isEn ? 'Get formal commercial proposal' : isZh ? '获取正式商业报价' : 'Отримати комерційну пропозицію'}</span>
              <ArrowRight size={17} />
            </Link>
            <div className="secondary-links">
              <Link 
                href={`/${locale}/products/${calculation.recommendedProductId}`}
                className="text-sublink"
              >
                {isEn ? 'View technical datasheet →' : isZh ? '查看技术参数表 →' : 'Технічні характеристики моделі →'}
              </Link>
              <Link 
                href={`/${locale}/engineering/bess-calculator?powerKw=${powerKw}&capacityKwh=${calculation.recommendedCapacityKwh}`}
                className="text-sublink"
              >
                {isEn ? 'Detailed engineering sizing →' : isZh ? '深入工程测算 →' : 'Детальний BESS калькулятор →'}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
