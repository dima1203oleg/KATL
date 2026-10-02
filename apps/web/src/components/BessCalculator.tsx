'use client';

import { useState } from 'react';
import { ArrowRight, RotateCw } from 'lucide-react';
import Link from 'next/link';

type Result={algorithmVersion:string;calculatedAt:string;input:{solarMw:number;loadMw:number;durationHours:number;reservePct:number};requestedPowerMw:number;requestedDeliverableEnergyMwh:number;nominalEnergyWithReserveMwh:number;assumptions:string[];limitations:string[]};
export function BessCalculator({locale}:{locale:string}){
 const [form,setForm]=useState({solarMw:'',loadMw:'',durationHours:'',reservePct:'0'});
 const [result,setResult]=useState<Result|null>(null);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const update=(event:React.ChangeEvent<HTMLInputElement>)=>setForm({...form,[event.target.name]:event.target.value});
 async function calculate(event:React.FormEvent){event.preventDefault();setError('');setBusy(true);setResult(null);
  try{const response=await fetch('/api/v1/calculations/bess',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({solarMw:Number(form.solarMw||0),loadMw:Number(form.loadMw),durationHours:Number(form.durationHours),reservePct:Number(form.reservePct)})});const data=await response.json();if(!response.ok)throw new Error('Перевірте значення потужності, тривалості та резерву.');setResult(data.data);}catch(error){setError(error instanceof Error?error.message:'Калькулятор тимчасово недоступний.');}finally{setBusy(false);}
 }
 return <div className="calc-layout"><form className="calc-card" onSubmit={calculate}><h2 style={{marginTop:0}}>Вихідні параметри</h2><p style={{color:'#667085',fontSize:12}}>Введіть потрібну потужність навантаження та бажану тривалість віддачі.</p><div className="form-grid" style={{gridTemplateColumns:'1fr'}}>
  <NumberField label="Потужність навантаження, MW" name="loadMw" value={form.loadMw} min="0.001" step="any" required onChange={update}/>
  <NumberField label="Тривалість, години" name="durationHours" value={form.durationHours} min="0.1" max="168" step="any" required onChange={update}/>
  <NumberField label="Резерв енергії, %" name="reservePct" value={form.reservePct} min="0" max="50" step="any" onChange={update}/>
  <NumberField label="PV потужність, MW (контекст)" name="solarMw" value={form.solarMw} min="0" step="any" onChange={update}/>
 </div><button className="button" style={{marginTop:20}} disabled={busy}>{busy?<><RotateCw size={15}/>Розраховуємо…</>:<>Розрахувати <ArrowRight size={15}/></>}</button></form>
 <section className="calc-card" aria-live="polite"><h2 style={{marginTop:0}}>Попередній результат</h2>{error&&<p className="error-note" role="alert">{error}</p>}{!result&&!error&&<div className="empty-state"><div><h3>Введіть параметри, щоб побачити оцінку</h3><p>Результат не обирає модель обладнання і не є проєктним рішенням.</p></div></div>}{result&&<><div className="calc-results"><Metric label="Потрібна потужність" value={`${fmt(result.requestedPowerMw)} MW`}/><Metric label="Потрібна відпускна енергія" value={`${fmt(result.requestedDeliverableEnergyMwh)} MWh`}/><Metric label="Енергія з введеним резервом" value={`${fmt(result.nominalEnergyWithReserveMwh)} MWh`}/><Metric label="Версія алгоритму" value={result.algorithmVersion}/></div><h3 style={{fontSize:14,marginTop:24}}>Припущення</h3><ul className="field-hint">{result.assumptions.map(item=><li key={item}>{item}</li>)}</ul><h3 style={{fontSize:14,marginTop:19}}>Обмеження</h3><ul className="field-hint">{result.limitations.map(item=><li key={item}>{item}</li>)}</ul><p className="field-hint">Розраховано: {new Date(result.calculatedAt).toLocaleString(locale)}</p><Link className="button button-secondary" href={`/${locale}/rfq?powerKw=${Math.round(result.requestedPowerMw*1000)}&capacityKwh=${Math.round(result.nominalEnergyWithReserveMwh*1000)}&durationHours=${result.input.durationHours}`}>Передати параметри в RFQ <ArrowRight size={14}/></Link></>}</section></div>
}
function NumberField({label,name,value,min,max,step,required,onChange}:{label:string;name:string;value:string;min?:string;max?:string;step?:string;required?:boolean;onChange:(event:React.ChangeEvent<HTMLInputElement>)=>void}){return <div className="field"><label htmlFor={name}>{label}</label><input id={name} name={name} type="number" inputMode="decimal" value={value} min={min} max={max} step={step} required={required} onChange={onChange}/></div>}
function Metric({label,value}:{label:string;value:string}){return <div className="calc-result"><small>{label}</small><strong>{value}</strong></div>}
function fmt(value:number){return new Intl.NumberFormat('uk-UA',{maximumFractionDigits:3}).format(value)}
