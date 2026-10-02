'use client';

import { useState } from 'react';
import { ArrowRight, CircleCheck } from 'lucide-react';

type Values = Record<string,string>;
export function RfqForm({ locale, product, attribution = {}, initial = {} }: { locale:string; product?:string; attribution?:Record<string,string>; initial?:Values }) {
  const [values,setValues]=useState<Values>({ selectedSeries:product||'', country:'UA', locale, ...initial, ...attribution });
  const [state,setState]=useState<{kind:'idle'|'sending'|'success'|'error';message?:string;id?:string}>({kind:'idle'});
  const update=(event:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setValues({...values,[event.target.name]:event.target.value});
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!event.currentTarget.reportValidity())return;
    setState({kind:'sending'});
    const payload={...values,landingPage:window.location.pathname+window.location.search,selectedProducts:values.selectedSeries?[values.selectedSeries]:[]};
    for(const key of ['powerKw','capacityKwh','durationHours']) if(!payload[key as keyof typeof payload]) delete payload[key as keyof typeof payload];
    try{
      const response=await fetch('/api/v1/rfq',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok) throw new Error(result.error==='VALIDATION_ERROR'?'Перевірте обов’язкові поля та формат контактних даних.':'Не вдалося надіслати запит. Спробуйте пізніше.');
      setState({kind:'success',id:result.data?.id,message:result.message||'Запит зареєстровано.'});
    }catch(error){setState({kind:'error',message:error instanceof Error?error.message:'Не вдалося надіслати запит.'});}
  }
  if(state.kind==='success') return <div className="empty-state" role="status"><CircleCheck color="#16845b" size={28}/><div><h3>Запит зареєстровано</h3><p>{state.message} Номер звернення: <strong>{state.id}</strong>. Наступний крок — перевірка вихідних даних командою KATL.</p></div></div>;
  return <form className="calc-card" onSubmit={submit} noValidate>
    <div className="form-grid">
      <Field label="Компанія" name="companyName" required value={values.companyName||''} onChange={update}/>
      <Field label="Контактна особа" name="contactPerson" required value={values.contactPerson||''} onChange={update}/>
      <Field label="Робочий email" name="email" type="email" required value={values.email||''} onChange={update}/>
      <Field label="Телефон" name="phone" type="tel" required value={values.phone||''} onChange={update}/>
      <Field label="Область / регіон" name="region" value={values.region||''} onChange={update}/>
      <div className="field"><label htmlFor="industry">Галузь</label><select id="industry" name="industry" value={values.industry||''} onChange={update}><option value="">Оберіть галузь</option><option>Виробництво</option><option>Агросектор</option><option>Логістика</option><option>Відновлювана енергетика</option><option>EV charging</option><option>Інше</option></select></div>
      <Field label="Потрібна потужність, kW" name="powerKw" type="number" value={values.powerKw||''} onChange={update}/>
      <Field label="Потрібна енергія, kWh" name="capacityKwh" type="number" value={values.capacityKwh||''} onChange={update}/>
      <Field label="Тривалість розряду, год" name="durationHours" type="number" value={values.durationHours||''} onChange={update}/>
      <div className="field"><label htmlFor="useCase">Основне завдання</label><select id="useCase" name="useCase" value={values.useCase||''} onChange={update}><option value="">Оберіть сценарій</option><option>Peak shaving</option><option>Резервне живлення</option><option>Сонячна енергетика</option><option>Арбітраж</option><option>Мікромережа</option><option>Інше</option></select></div>
      <div className="field" style={{gridColumn:'1 / -1'}}><label htmlFor="details">Опис проєкту</label><textarea id="details" name="details" maxLength={10000} value={values.details||''} onChange={update} placeholder="Місце встановлення, профіль навантаження, джерела генерації та обмеження майданчика."/><span className="field-hint">Не надсилайте конфіденційні або персональні дані, які не потрібні для оцінки.</span></div>
      <label style={{gridColumn:'1 / -1',fontSize:12,display:'flex',gap:9,alignItems:'flex-start'}}><input type="checkbox" required/> Я погоджуюся на обробку контактних даних для відповіді на цей запит і приймаю <a className="text-link" href={`/${locale}/privacy`}>політику приватності</a>.</label>
    </div>
    {state.kind==='error'&&<p className="error-note" role="alert">{state.message}</p>}
    <button className="button" style={{marginTop:20}} disabled={state.kind==='sending'}>{state.kind==='sending'?'Надсилаємо…':'Надіслати запит'} <ArrowRight size={15}/></button>
    <p className="field-hint" style={{marginTop:13}}>Після надсилання запит буде збережено в системі. Час відповіді залежить від повноти даних і доступності команди.</p>
  </form>;
}

function Field({label,name,type='text',required,value,onChange}:{label:string;name:string;type?:string;required?:boolean;value:string;onChange:(event:React.ChangeEvent<HTMLInputElement>)=>void}){return <div className="field"><label htmlFor={name}>{label}{required?' *':''}</label><input id={name} name={name} type={type} required={required} value={value} onChange={onChange}/></div>}
