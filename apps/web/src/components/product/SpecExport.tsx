'use client';

import { Download } from 'lucide-react';

/** Downloads the rendered spec sheet as CSV (UTF-8 with BOM so Excel opens Cyrillic/Chinese correctly). */
export function SpecExport({ csv, filename, label }: { csv: string; filename: string; label: string }) {
  function download() {
    const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button type="button" className="kx-pdp-tool" onClick={download}>
      <Download size={15} aria-hidden="true" />
      {label}
    </button>
  );
}
