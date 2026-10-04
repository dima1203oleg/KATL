/**
 * Deterministic, ILLUSTRATIVE energy-flow models for the homepage storytelling.
 * They demonstrate how a BESS behaves in typical operating modes on a synthetic profile.
 * They are not sizing results for any real site — real sizing lives in @katl/calculations
 * and the BESS Designer, which take measured data.
 */

export type FlowMode = 'peak' | 'solar' | 'backup' | 'arbitrage';

export interface FlowFrame {
  t: number; // hour of day, 0..24
  load: number; // kW served to the facility
  solar: number; // kW produced by PV
  solarToLoad: number;
  solarToBess: number;
  solarToGrid: number;
  gridToLoad: number;
  gridToBess: number;
  bessToLoad: number;
  soc: number; // 0..1
  gridUp: boolean;
  price: 'low' | 'mid' | 'high';
}

const STEP = 0.25; // h
const BESS_KW = 600;
const BESS_KWH = 1600;
const EFF = 0.92; // one-way charge efficiency used for the illustration
const RESERVE = 0.1; // BMS keeps 10% in reserve — the battery is never shown drained to zero

/** Synthetic two-shift manufacturing profile, kW. */
export function factoryLoad(t: number) {
  const h = ((t % 24) + 24) % 24;
  let kw = 520;
  if (h >= 6 && h < 8) kw = 520 + (h - 6) * 480;
  else if (h >= 8 && h < 12) kw = 1480 + Math.sin((h - 8) * 1.4) * 260;
  else if (h >= 12 && h < 13) kw = 1150;
  else if (h >= 13 && h < 18) kw = 1520 + Math.sin((h - 13) * 1.2) * 240;
  else if (h >= 18 && h < 22) kw = 1500 - (h - 18) * 230;
  return Math.round(kw);
}

/** Synthetic clear-day PV curve for a ~1 MWp plant, kW. */
export function solarCurve(t: number, peakKw = 1000) {
  const h = ((t % 24) + 24) % 24;
  if (h < 6 || h > 20) return 0;
  return Math.round(Math.max(0, Math.sin((Math.PI * (h - 6)) / 14)) * peakKw);
}

/** Typical shape of Ukrainian day-ahead prices: cheap at night and in solar hours, expensive at the morning and evening ramps. */
function priceAt(h: number): FlowFrame['price'] {
  if (h < 5 || (h >= 11 && h < 15)) return 'low';
  if ((h >= 7 && h < 9) || (h >= 18 && h < 22)) return 'high';
  return 'mid';
}

export function simulateDay(mode: FlowMode): FlowFrame[] {
  const frames: FlowFrame[] = [];
  let soc = mode === 'backup' ? 0.95 : 0.35;
  const threshold = 1450;
  for (let t = 0; t < 24 + 1e-9; t += STEP) {
    const h = t % 24;
    const gridUp = !(mode === 'backup' && h >= 17 && h < 20.5);
    const pvPeak = mode === 'solar' ? 2400 : mode === 'backup' ? 1200 : mode === 'peak' ? 500 : 0;
    const solar = pvPeak ? solarCurve(h, pvPeak) : 0;
    let load = factoryLoad(h);
    if (!gridUp) load = Math.round(load * 0.45); // only critical loads stay on during the outage

    const solarToLoad = Math.min(solar, load);
    const surplus = solar - solarToLoad;
    const residual = load - solarToLoad;
    const room = (1 - soc) * BESS_KWH;
    const avail = Math.max(0, soc - RESERVE) * BESS_KWH;
    let discharge = 0;
    let charge = 0;

    if (mode === 'peak') {
      if (residual > threshold) discharge = Math.min(residual - threshold, BESS_KW, avail / STEP);
      else if (h < 6 || h >= 22) charge = Math.min(BESS_KW * 0.6, room / STEP / EFF, Math.max(0, threshold - residual));
    } else if (mode === 'solar') {
      if (surplus > 0) charge = Math.min(surplus, BESS_KW, room / STEP / EFF);
      else if (h >= 17 && h < 23) discharge = Math.min(residual, BESS_KW, avail / STEP);
    } else if (mode === 'backup') {
      if (!gridUp) discharge = Math.min(residual, BESS_KW, avail / STEP);
      else if (soc < 0.95) charge = Math.min(BESS_KW * 0.5, room / STEP / EFF, surplus + 400);
    } else if (mode === 'arbitrage') {
      const p = priceAt(h);
      if (p === 'low') charge = Math.min(BESS_KW, room / STEP / EFF);
      else if (p === 'high') discharge = Math.min(BESS_KW, residual, avail / STEP);
    }

    const solarToBess = Math.min(charge, surplus);
    const gridToBess = gridUp ? charge - solarToBess : 0;
    const realCharge = solarToBess + gridToBess;
    soc = Math.min(1, Math.max(0, soc + (realCharge * EFF - discharge) * STEP / BESS_KWH));
    const gridToLoad = gridUp ? Math.max(0, residual - discharge) : 0;
    const solarToGrid = gridUp ? Math.max(0, surplus - solarToBess) : 0;

    frames.push({
      t, load, solar, solarToLoad, solarToBess, solarToGrid, gridToLoad, gridToBess,
      bessToLoad: discharge, soc, gridUp, price: priceAt(h),
    });
  }
  return frames;
}

/* ------------------------------------------------------------------ */
/* Peak-shaving lab: 15-minute simulation on selectable synthetic profiles */

export type ProfileId = 'factory' | 'cold' | 'agro';

export function profileLoad(id: ProfileId, t: number) {
  const h = ((t % 24) + 24) % 24;
  if (id === 'cold') {
    // Cold-storage warehouse: compressors cycle, afternoon thermal peak, loading docks in the morning.
    const base = 700 + 140 * Math.sin((Math.PI * (h - 9)) / 12);
    const docks = h >= 6 && h < 10 ? 380 : 0;
    const thermal = h >= 13 && h < 17 ? 420 * Math.sin((Math.PI * (h - 13)) / 4) : 0;
    const cycle = 60 * Math.sin(h * 6.3);
    return Math.round(base + docks + thermal + cycle);
  }
  if (id === 'agro') {
    // Grain elevator / dryer in season: long day plateau with motor-start spikes.
    let kw = 260;
    if (h >= 7 && h < 21) kw = 980 + 120 * Math.sin(h * 1.7);
    if ([8, 11, 14, 17].some((s) => h >= s && h < s + 0.5)) kw += 520;
    return Math.round(kw);
  }
  return factoryLoad(h);
}

export interface PeakResult {
  points: Array<{ t: number; before: number; after: number; soc: number }>;
  peakBefore: number;
  peakAfter: number;
  dischargedKwh: number;
  unservedKwh: number; // energy above the target that the battery could not cover
  limitedBy: 'none' | 'power' | 'energy';
}

export function simulatePeakShaving(id: ProfileId, targetKw: number, powerKw: number, energyKwh: number): PeakResult {
  const step = 0.25;
  const usable = energyKwh * 0.9; // keep a 10% reserve window for the illustration
  let stored = usable; // start the day full (recharged overnight)
  let dischargedKwh = 0;
  let unservedKwh = 0;
  let hitPower = false;
  let hitEnergy = false;
  const points: PeakResult['points'] = [];
  let peakBefore = 0;
  let peakAfter = 0;
  for (let t = 0; t < 24; t += step) {
    const before = profileLoad(id, t);
    let after = before;
    if (before > targetKw) {
      const need = before - targetKw;
      const byPower = Math.min(need, powerKw);
      const byEnergy = Math.min(byPower, stored / step);
      if (byPower < need) hitPower = true;
      if (byEnergy < byPower) hitEnergy = true;
      stored -= byEnergy * step;
      dischargedKwh += byEnergy * step;
      unservedKwh += (need - byEnergy) * step;
      after = before - byEnergy;
    } else if (stored < usable) {
      const headroom = targetKw - before;
      const charge = Math.min(powerKw, headroom, (usable - stored) / step / EFF);
      if (charge > 0) {
        stored += charge * EFF * step;
        after = before + charge;
      }
    }
    peakBefore = Math.max(peakBefore, before);
    peakAfter = Math.max(peakAfter, after);
    points.push({ t, before, after: Math.round(after), soc: usable ? stored / usable : 0 });
  }
  return {
    points, peakBefore, peakAfter: Math.round(peakAfter),
    dischargedKwh: Math.round(dischargedKwh), unservedKwh: Math.round(unservedKwh),
    limitedBy: unservedKwh < 1 ? 'none' : hitEnergy ? 'energy' : hitPower ? 'power' : 'none',
  };
}
