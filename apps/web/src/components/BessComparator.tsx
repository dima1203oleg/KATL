'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import type { KatlProduct } from '@katl/shared-types';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Filter, 
  X, 
  Plus, 
  Sparkles,
  Sliders
} from 'lucide-react';

interface BessComparatorProps {
  products: KatlProduct[];
  locale?: string;
  initialSelectedIds?: string[];
  onSelectProductForDesigner?: (productId: string) => void;
}

export function BessComparator({
  products,
  locale = 'uk-UA',
  initialSelectedIds = ['catl-tener-6250', 'catl-enerone-plus', 'catl-enerc-plus'],
  onSelectProductForDesigner,
}: BessComparatorProps) {
  const isEn = locale === 'en';
  const isZh = locale === 'zh-CN';

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const validIds = initialSelectedIds.filter((id) => products.some((p) => p.id === id));
    return validIds.length >= 2 
      ? validIds.slice(0, 4) 
      : products.slice(0, 3).map((p) => p.id);
  });

  const [onlyDifferences, setOnlyDifferences] = useState<boolean>(false);

  const selectedProducts = useMemo(() => {
    return selectedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is KatlProduct => Boolean(p));
  }, [selectedIds, products]);

  // Handle add/remove product
  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Spec rows configuration
  const specRows = useMemo(() => {
    return [
      {
        id: 'category',
        label: isEn ? 'Category' : isZh ? '产品类别' : 'Категорія',
        getValue: (p: KatlProduct) => p.category,
      },
      {
        id: 'capacity',
        label: isEn ? 'Nominal Capacity' : isZh ? '额定容量' : 'Номінальна ємність',
        getValue: (p: KatlProduct) => p.energySpecs.nominalCapacity || '—',
      },
      {
        id: 'voltage',
        label: isEn ? 'Nominal Voltage' : isZh ? '额定电压' : 'Номінальна напруга',
        getValue: (p: KatlProduct) => p.energySpecs.nominalVoltage || '—',
      },
      {
        id: 'cRate',
        label: isEn ? 'C-rate' : isZh ? '充放电倍率' : 'Робочий C-rate',
        getValue: (p: KatlProduct) => p.energySpecs.cRate || '0.5C',
      },
      {
        id: 'cooling',
        label: isEn ? 'Thermal Management' : isZh ? '热管理方式' : 'Охолодження',
        getValue: (p: KatlProduct) => p.thermalSpecs.coolingMethod || 'Liquid Cooling',
      },
      {
        id: 'chemistry',
        label: isEn ? 'Cell Chemistry' : isZh ? '电芯化学体系' : 'Технологія комірок',
        getValue: (p: KatlProduct) => p.cellSpecs.chemistry || 'LFP',
      },
      {
        id: 'cycleLife',
        label: isEn ? 'Cycle Life' : isZh ? '循环寿命' : 'Циклічний ресурс',
        getValue: (p: KatlProduct) => p.cellSpecs.cycleLife || '10 000+ циклів',
      },
      {
        id: 'degradation',
        label: isEn ? 'Degradation Guarantee' : isZh ? '衰减保证' : 'Гарантія деградації',
        getValue: (p: KatlProduct) => p.cellSpecs.degradationFirstYears || 'Стандартна LFP',
      },
      {
        id: 'dimensions',
        label: isEn ? 'Dimensions (L×W×H)' : isZh ? '外形尺寸' : 'Габарити',
        getValue: (p: KatlProduct) => p.mechanicalSpecs.dimensions || '—',
      },
      {
        id: 'weight',
        label: isEn ? 'Weight' : isZh ? '重量' : 'Маса',
        getValue: (p: KatlProduct) => p.mechanicalSpecs.weight || '—',
      },
      {
        id: 'protectionRating',
        label: isEn ? 'Ingress Protection' : isZh ? '防护等级' : 'Ступінь захисту (IP)',
        getValue: (p: KatlProduct) => p.mechanicalSpecs.protectionRating || 'IP55',
      },
      {
        id: 'pricing',
        label: isEn ? 'Starting Price' : isZh ? '参考价格' : 'Орієнтовна ціна',
        getValue: (p: KatlProduct) =>
          ((p.energySpecs as any)?.priceDisplayUah) || (isEn ? 'On request' : isZh ? '价格电议' : 'Ціна за запитом'),
      },
      {
        id: 'warranty',
        label: isEn ? 'Warranty' : isZh ? '质保周期' : 'Гарантійний строк',
        getValue: (p: KatlProduct) =>
          ((p.energySpecs as any)?.warrantyYears) || (isEn ? '10 Years' : isZh ? '10 年' : '10 років'),
      },
    ];
  }, [isEn, isZh]);

  // Filter rows if "onlyDifferences" is active
  const displayedRows = useMemo(() => {
    if (!onlyDifferences) return specRows;
    return specRows.filter((row) => {
      const values = selectedProducts.map((p) => row.getValue(p));
      const firstVal = values[0];
      return values.some((val) => val !== firstVal);
    });
  }, [specRows, selectedProducts, onlyDifferences]);

  return (
    <div className="comparator-container">
      {/* Top Toolbar */}
      <div className="comparator-toolbar">
        <div className="toolbar-left">
          <span className="selection-badge">
            <Layers size={14} />
            {isEn ? `Selected ${selectedProducts.length} of 4` : isZh ? `已选 ${selectedProducts.length} / 4 款系统` : `Обрано ${selectedProducts.length} з 4 систем`}
          </span>

          <label className="diff-toggle">
            <input
              type="checkbox"
              checked={onlyDifferences}
              onChange={(e) => setOnlyDifferences(e.target.checked)}
            />
            <span className="slider round"></span>
            <span className="diff-label">
              {isEn ? 'Show only differences' : isZh ? '仅显示差异项' : 'Показувати тільки відмінності'}
            </span>
          </label>
        </div>

        {/* Product selector buttons */}
        <div className="toolbar-selector">
          <span className="selector-title">{isEn ? 'Add system to compare:' : isZh ? '添加对比型号：' : 'Додати модель до порівняння:'}</span>
          <div className="selector-pills">
            {products.map((prod) => {
              const isSelected = selectedIds.includes(prod.id);
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => toggleProduct(prod.id)}
                  className={`pill-btn ${isSelected ? 'selected' : ''}`}
                  disabled={!isSelected && selectedIds.length >= 4}
                >
                  {isSelected ? <Check size={12} /> : <Plus size={12} />}
                  <span>{prod.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="comparator-table-wrap">
        <table className="comparator-table">
          <thead>
            <tr>
              <th className="th-param">
                <span className="param-header-text">
                  {isEn ? 'Technical Parameter' : isZh ? '技术参数' : 'Характеристика'}
                </span>
              </th>
              {selectedProducts.map((prod) => {
                const energySpecs = prod.energySpecs as any;
                const price = energySpecs?.priceDisplayUah || (isEn ? 'On request' : isZh ? '价格电议' : 'Ціна за запитом');

                return (
                  <th key={prod.id} className="th-product">
                    <div className="product-header-card">
                      <div className="th-top-row">
                        <span className="th-category">{prod.category}</span>
                        {selectedIds.length > 2 && (
                          <button
                            type="button"
                            onClick={() => toggleProduct(prod.id)}
                            className="remove-btn"
                            title={isEn ? 'Remove from compare' : 'Видалити з порівняння'}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <h3 className="th-title">{prod.name}</h3>
                      <div className="th-price-box">{price}</div>
                      <div className="th-actions">
                        <Link
                          href={`/${locale}/rfq?product=${encodeURIComponent(prod.id)}`}
                          className="button th-btn"
                        >
                          {isEn ? 'Quote' : isZh ? '询价' : 'Запит КП'}
                        </Link>
                        <Link
                          href={`/${locale}/products/${encodeURIComponent(prod.id)}`}
                          className="button button-secondary th-btn"
                        >
                          {isEn ? 'Details' : isZh ? '详情' : 'Картка'}
                        </Link>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {displayedRows.map((row, idx) => {
              const values = selectedProducts.map((p) => row.getValue(p));
              const isDifferent = values.some((val) => val !== values[0]);

              return (
                <tr key={row.id} className={`${idx % 2 === 0 ? 'row-even' : 'row-odd'} ${isDifferent ? 'row-highlight' : ''}`}>
                  <td className="td-label">
                    <strong>{row.label}</strong>
                  </td>
                  {selectedProducts.map((prod, pIdx) => {
                    const cellVal = row.getValue(prod);
                    const isWinning = row.id === 'capacity' || row.id === 'cycleLife';

                    return (
                      <td key={prod.id} className={`td-value ${pIdx === 0 ? 'col-first' : ''}`}>
                        <div className="cell-content">
                          <span>{cellVal}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            <tr className="tfoot-row">
              <td className="td-label">
                <strong>{isEn ? 'Actions' : isZh ? '后续操作' : 'Дія:'}</strong>
              </td>
              {selectedProducts.map((prod) => (
                <td key={prod.id} className="td-value">
                  <div className="foot-actions">
                    <Link
                      href={`/${locale}/rfq?product=${encodeURIComponent(prod.id)}`}
                      className="button button-primary-accent w-full"
                    >
                      {isEn ? 'Get formal proposal' : isZh ? '获取方案' : 'Отримати КП'}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
