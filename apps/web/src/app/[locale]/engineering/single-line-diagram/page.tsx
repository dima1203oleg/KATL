import React from 'react';
import { BessSingleLineDiagram } from '@/components/BessSingleLineDiagram';

export default function SingleLineDiagramPage() {
  return (
    <main className="min-h-screen bg-[#0b0c10] text-white">
      <div className="pt-24 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Single Line Diagram</h1>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Інтерактивна схема типового підключення промислових систем CATL.
        </p>
      </div>
      <BessSingleLineDiagram />
    </main>
  );
}
