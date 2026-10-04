'use client';

import { useEffect } from 'react';

/**
 * Scroll-reveal for elements marked `data-reveal`. Content is visible by default (SSR, no-JS,
 * crawlers); the hidden start state applies only once this script adds `kx-reveal-on` to <html>,
 * and never when the user prefers reduced motion.
 */
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = document.documentElement;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    // Anything already on screen stays as is — no flash for above-the-fold content.
    for (const el of nodes) if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
    root.classList.add('kx-reveal-on');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    nodes.forEach((el) => { if (!el.classList.contains('is-in')) io.observe(el); });
    return () => { io.disconnect(); root.classList.remove('kx-reveal-on'); };
  }, []);
  return null;
}
