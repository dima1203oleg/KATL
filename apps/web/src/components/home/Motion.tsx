'use client';

import { useEffect } from 'react';

/**
 * Light-weight micro-interactions: reading-progress bar and pointer spotlight on cards.
 * Pure enhancement — nothing depends on it; disabled under reduced motion.
 */
export function Motion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bar = document.getElementById('kx-progress');
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
      });
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('.kx-tool, .kx-role, .kx-tile, .kx-pillar');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);
  return <div id="kx-progress" className="kx-progress" aria-hidden="true" />;
}
