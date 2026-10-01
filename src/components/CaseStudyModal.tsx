import React from 'react';
import { X, CheckCircle, ArrowUpRight, Code, Server, Smartphone, ExternalLink } from 'lucide-react';
import { CaseStudy, Language } from '../types';

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  onClose: () => void;
  lang: Language;
  onOpenEstimator: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  onClose,
  lang,
  onOpenEstimator,
}) => {
  if (!caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#12141d] p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Metadata */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
          <span>{caseStudy.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{caseStudy.year}</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-400">{caseStudy.client}</span>
        </div>

        {/* Modal Title */}
        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4">
          {caseStudy.title}
        </h3>

        {/* High-impact metric highlight box */}
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {lang === 'ua' ? 'Головне досягнення проєкту' : 'Key Project Milestone'}
            </div>
            <div className="text-xs text-neutral-300 mt-0.5">
              {caseStudy.metricLabel}
            </div>
          </div>
          <div className="font-display text-3xl sm:text-4xl font-extrabold text-amber-300 tabular-nums">
            {caseStudy.metricHighlight}
          </div>
        </div>

        {/* Problem & Challenge */}
        <div className="space-y-6 text-sm text-neutral-300">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              {lang === 'ua' ? 'Вихідна задача та виклики:' : 'The Challenge:'}
            </h4>
            <p className="leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
              {caseStudy.challenge}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              {lang === 'ua' ? 'Наше технічне рішення:' : 'The Engineering Solution:'}
            </h4>
            <p className="leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">
              {caseStudy.solution}
            </p>
          </div>

          {/* Key Deliverables & Outcomes */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
              {lang === 'ua' ? 'Вимірювані бізнес-результати:' : 'Measurable Business Results:'}
            </h4>
            <div className="space-y-2">
              {caseStudy.results.map((res, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-200">{res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              {lang === 'ua' ? 'Технологічний стек:' : 'Engineered With:'}
            </h4>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-300">
              {caseStudy.technologies.map((tech, idx) => (
                <React.Fragment key={tech}>
                  <span className="font-mono text-amber-300/90">{tech}</span>
                  {idx < caseStudy.technologies.length - 1 && (
                    <span className="text-neutral-600" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-neutral-400">
            {lang === 'ua' ? 'Бажаєте подібне рішення для вашого бізнесу?' : 'Looking for similar impact in your business?'}
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenEstimator();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-amber-400 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-300 transition-colors"
          >
            <span>{lang === 'ua' ? 'Розрахувати аналогічний проєкт' : 'Estimate Similar Project'}</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
