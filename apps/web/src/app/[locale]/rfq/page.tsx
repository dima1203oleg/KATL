import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RfqForm } from '../../../components/RfqForm';

export const metadata: Metadata = { title:'Запит комерційної та інженерної пропозиції', description:'Передайте параметри BESS проєкту для подальшої інженерної оцінки.' };
export const dynamic = 'force-dynamic';

export default async function RfqPage({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const [{locale},query]=await Promise.all([params,searchParams]);
  if(!['uk-UA','en','zh-CN'].includes(locale)) notFound();
  const attribution:Record<string,string>={};
  for(const key of ['utmSource','utmMedium','utmCampaign','utmContent','utmTerm']){
    const queryKey=key.replace(/[A-Z]/g,letter=>`_${letter.toLowerCase()}`);
    const value=query[queryKey];
    if(typeof value==='string') attribution[key]=value.slice(0,128);
  }
  const product=query.product;
  const initial:Record<string,string>={};for(const key of ['powerKw','capacityKwh','durationHours']){const value=query[key];if(typeof value==='string'&&/^\d+(\.\d+)?$/.test(value))initial[key]=value;}
  return <main><section className="page-hero"><div className="container"><div className="breadcrumbs">Проєкт　/　Запит пропозиції</div><div className="eyebrow">НАСТУПНИЙ КРОК</div><h1>Розкажіть про ваш об’єкт</h1><p>Надайте відомі параметри. Якщо частини даних ще немає, залиште поля порожніми — ми уточнимо вимоги перед підбором системи.</p></div></section><section className="content-section"><div className="container" style={{maxWidth:920}}><RfqForm locale={locale} product={typeof product==='string'?product:undefined} attribution={attribution} initial={initial}/></div></section></main>;
}
