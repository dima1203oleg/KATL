import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, Eye, X, CheckCircle2 } from 'lucide-react';
import { bessDocuments, BessDocument } from '../data/bessData';

export const BessDocumentLibrary: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<BessDocument | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownload = (doc: BessDocument) => {
    setDownloadSuccess(doc.title);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <section id="documents" className="py-20 md:py-28 border-b border-white/5 bg-[#0a0b10]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Документація & Сертифікати
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mt-2 [text-wrap:balance]">
              Бібліотека верифікованих технічних специфікацій
            </h2>
            <p className="text-base text-neutral-300 mt-3 leading-relaxed">
              Офіційні паспорти виробів CATL, звіти випробувань пожежної безпеки UL 9540A та типові однолінійні схеми підключення до РУ-10 кВ.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Офіційні версії CATL</span>
            <span aria-hidden="true">·</span>
            <span>HTML-контекст</span>
            <span aria-hidden="true">·</span>
            <span>ДСТУ EN 62619</span>
          </div>
        </div>

        {/* 4 Document Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bessDocuments.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-white/10 bg-[#12141c] p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-400/40 transition-colors"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-xs font-mono text-neutral-400">
                  <span className="text-emerald-400 font-semibold">{doc.category}</span>
                  <span>{doc.fileSize} · {doc.pages} стор.</span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                  {doc.summary}
                </p>

                <div className="text-[11px] font-mono text-neutral-400 pt-1">
                  Джерело верифікації: <span className="text-neutral-200">{doc.verificationSource}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Переглянути паспорт (HTML)</span>
                </button>

                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1.5 rounded-md bg-white/5 hover:bg-emerald-400 hover:text-black px-3.5 py-1.5 text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Завантажити PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback alert */}
        {downloadSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Файл «{downloadSuccess}» успішно згенеровано для завантаження!</span>
          </div>
        )}

        {/* Modal HTML Preview for Document */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
              className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#12141d] p-6 sm:p-8 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedDoc(null)}
                className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-xs font-mono text-emerald-400 mb-1">{selectedDoc.category} · {selectedDoc.product}</div>
              <h3 className="font-display text-xl font-bold text-white mb-4">{selectedDoc.title}</h3>

              <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
                <div className="p-3 bg-black/40 rounded-lg border border-white/5 font-mono text-xs">
                  <div>Формат: Офіційний інженерний паспорт PDF</div>
                  <div>Обсяг: {selectedDoc.pages} сторінок ({selectedDoc.fileSize})</div>
                  <div>Верифікація: {selectedDoc.verificationSource}</div>
                </div>

                <p className="leading-relaxed">
                  {selectedDoc.summary}
                </p>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1 text-neutral-200">
                  <div className="font-bold text-emerald-400">Інженерна примітка:</div>
                  <div>Документ містить вихідні габаритно-приєднувальні розміри, вимоги до вентиляції за NFPA 855 та вимоги до фундаментної плити під контейнери/шафи.</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => {
                    handleDownload(selectedDoc);
                    setSelectedDoc(null);
                  }}
                  className="flex items-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-300"
                >
                  <Download className="h-4 w-4" />
                  <span>Підтвердити завантаження документа</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
