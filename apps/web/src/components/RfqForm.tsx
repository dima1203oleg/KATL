'use client';

import React, { useState, useRef } from 'react';
import { ArrowRight, CircleCheck, UploadCloud, X, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

type Values = Record<string, string>;

interface RfqFormProps {
  locale: string;
  product?: string;
  attribution?: Record<string, string>;
  initial?: Values;
}

export function RfqForm({ locale, product, attribution = {}, initial = {} }: RfqFormProps) {
  const [values, setValues] = useState<Values>({
    selectedSeries: product || '',
    country: 'UA',
    locale,
    timeline: '3-6_months',
    ...initial,
    ...attribution,
  });

  const [files, setFiles] = useState<Array<{ name: string; size: number }>>([]);
  const [state, setState] = useState<{
    kind: 'idle' | 'sending' | 'success' | 'error';
    message?: string;
    id?: string;
  }>({ kind: 'idle' });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    'uk-UA': {
      title: 'Запит на розрахунок та комерційну пропозицію',
      name: "Ім'я та прізвище",
      company: 'Назва компанії',
      email: 'Робочий email',
      phone: 'Номер телефону',
      country: 'Країна',
      city: 'Місто / Населений пункт',
      facilityType: "Тип об'єкта",
      powerKw: 'Необхідна потужність, кВт',
      capacityKwh: 'Необхідна ємність, кВт·год',
      timeline: 'Бажаний термін впровадження',
      details: 'Опис проєкту та технічні вимоги',
      detailsPlaceholder: 'Вкажіть особливості майданчика, поточний ліміт потужності, режим роботи, джерела генерації або особливі вимоги до захисту/охолодження...',
      filesTitle: 'Прикріплення файлів (ТЕО, однолінійна схема, графік навантаження)',
      filesHint: 'Підтримуються PDF, DWG, XLSX, PNG розміром до 25 МБ',
      agreement: 'Я погоджуюся на обробку наданих технічних та контактних даних згідно з',
      privacy: 'політикою конфіденційності',
      submitBtn: 'Отримати комерційну пропозицію',
      sendingBtn: 'Формування заявки…',
      successTitle: 'Запит успішно зареєстровано!',
      successSub: 'Інженерна група KATL ESS Україна опрацює ваші вихідні дані та підготує техніко-комерційне рішення (ТКП).',
      refNum: 'Номер звернення:',
      validationError: 'Будь ласка, заповніть обов’язкові поля та перевірте правильність введених даних.',
      serverError: 'Не вдалося надіслати запит. Будь ласка, спробуйте знову або зв’яжіться з нами телефоном.',
      facilities: [
        { id: 'manufacturing', label: 'Промислове виробництво' },
        { id: 'agriculture', label: 'Агропромисловий сектор / Елеватор' },
        { id: 'logistics', label: 'Логістичний комплекс / Склад' },
        { id: 'solar_wind', label: 'Сонячна / Вітрова електростанція (СЕС/ВЕС)' },
        { id: 'datacenter', label: 'Дата-центр / IT-інфраструктура' },
        { id: 'commercial', label: 'Торговельний / Бізнес-центр' },
        { id: 'residential', label: 'Житловий комплекс / Котеджне містечко' },
        { id: 'infrastructure', label: 'Критична енергетична інфраструктура' },
        { id: 'other', label: 'Інше' },
      ],
      timelines: [
        { id: 'urgent', label: 'Терміново (1–2 місяці)' },
        { id: '3-6_months', label: '3–6 місяців (поточний квартал)' },
        { id: '6-12_months', label: '6–12 місяців (плановий проєкт)' },
        { id: 'budgeting', label: 'Попереднє бюджетування на 2027 рік' },
      ],
    },
    'en': {
      title: 'Commercial Proposal & Sizing Request',
      name: 'Full Name',
      company: 'Company Name',
      email: 'Corporate Email',
      phone: 'Phone Number',
      country: 'Country',
      city: 'City / Location',
      facilityType: 'Facility Type',
      powerKw: 'Required Power, kW',
      capacityKwh: 'Required Capacity, kWh',
      timeline: 'Target Implementation Timeline',
      details: 'Project Details & Specifications',
      detailsPlaceholder: 'Specify facility grid connection limits, peak shaving targets, existing PV/generators, ambient temperature requirements...',
      filesTitle: 'Attach Technical Files (SLD, load profiles, specs)',
      filesHint: 'Supported formats: PDF, DWG, XLSX, PNG up to 25 MB',
      agreement: 'I agree to the processing of technical and contact data in accordance with the',
      privacy: 'privacy policy',
      submitBtn: 'Get Commercial Proposal',
      sendingBtn: 'Registering Request…',
      successTitle: 'Request Successfully Registered!',
      successSub: 'Our KATL ESS engineering team will review your project parameters and issue a formal proposal (TKP).',
      refNum: 'Reference ID:',
      validationError: 'Please fill in required fields and verify contact details.',
      serverError: 'Failed to submit request. Please try again or contact us directly.',
      facilities: [
        { id: 'manufacturing', label: 'Manufacturing & Industrial Plant' },
        { id: 'agriculture', label: 'Agriculture & Grain Elevators' },
        { id: 'logistics', label: 'Logistics & Warehousing' },
        { id: 'solar_wind', label: 'Renewable Power Plant (Solar / Wind)' },
        { id: 'datacenter', label: 'Data Center & Telecom' },
        { id: 'commercial', label: 'Commercial & Retail Real Estate' },
        { id: 'residential', label: 'Residential Complex / Microgrid' },
        { id: 'infrastructure', label: 'Critical Energy Infrastructure' },
        { id: 'other', label: 'Other' },
      ],
      timelines: [
        { id: 'urgent', label: 'Urgent (1–2 months)' },
        { id: '3-6_months', label: '3–6 months' },
        { id: '6-12_months', label: '6–12 months' },
        { id: 'budgeting', label: 'Preliminary budgeting / Feasibility' },
      ],
    },
    'zh-CN': {
      title: '商业建议书与系统方案申请',
      name: '联系人姓名',
      company: '公司名称',
      email: '工作邮箱',
      phone: '联系电话',
      country: '国家',
      city: '城市 / 项目地点',
      facilityType: '项目设施类型',
      powerKw: '所需额定功率 (kW)',
      capacityKwh: '所需储能容量 (kWh)',
      timeline: '期望交付时间',
      details: '项目技术要求与负荷说明',
      detailsPlaceholder: '请注明电网接入电压、削峰填谷需求、现有光伏或发电机容量以及安装环境...',
      filesTitle: '上传技术文件 (系统图、负荷曲线、技术规范)',
      filesHint: '支持 PDF, DWG, XLSX, PNG，单个文件最大 25 MB',
      agreement: '我同意根据处理相关技术与联系信息',
      privacy: '隐私政策',
      submitBtn: '获取商业建议书',
      sendingBtn: '正在提交…',
      successTitle: '申请已成功提交！',
      successSub: 'KATL 乌克兰储能工程团队将评估您的系统参数并出具正式商业报价方案。',
      refNum: '申请编号：',
      validationError: '请完整填写必填字段并检查联系方式。',
      serverError: '提交失败，请稍后重试或直接联系我们。',
      facilities: [
        { id: 'manufacturing', label: '工业制造与重工业厂区' },
        { id: 'agriculture', label: '农业与大型仓储' },
        { id: 'logistics', label: '物流枢纽中心' },
        { id: 'solar_wind', label: '新能源电站 (光伏/风电配储)' },
        { id: 'datacenter', label: '数据中心与电信基础设施' },
        { id: 'commercial', label: '大型商业中心与园区' },
        { id: 'residential', label: '户用/社区独立微电网' },
        { id: 'infrastructure', label: '电网级关键基础设施' },
        { id: 'other', label: '其他' },
      ],
      timelines: [
        { id: 'urgent', label: '紧急 (1–2 个月)' },
        { id: '3-6_months', label: '3–6 个月' },
        { id: '6-12_months', label: '6–12 个月' },
        { id: 'budgeting', label: '前期可行性预算' },
      ],
    },
  }[locale === 'zh-CN' ? 'zh-CN' : locale === 'en' ? 'en' : 'uk-UA'];

  const update = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        name: f.name,
        size: f.size,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setState({ kind: 'sending' });

    let finalDetails = values.details || '';
    if (values.timeline) {
      finalDetails = `[Timeline: ${values.timeline}]\n${finalDetails}`;
    }
    if (files.length > 0) {
      finalDetails += `\n[Attached files: ${files.map((f) => `${f.name} (${Math.round(f.size / 1024)} KB)`).join(', ')}]`;
    }

    const payload = {
      ...values,
      details: finalDetails,
      landingPage: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
      selectedProducts: values.selectedSeries ? [values.selectedSeries] : [],
    };

    for (const key of ['powerKw', 'capacityKwh', 'durationHours']) {
      if (!payload[key as keyof typeof payload]) {
        delete payload[key as keyof typeof payload];
      }
    }

    try {
      const response = await fetch('/api/v1/rfq', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error === 'VALIDATION_ERROR' ? t.validationError : t.serverError);
      }

      setState({
        kind: 'success',
        id: result.data?.id,
        message: result.message || t.successTitle,
      });
    } catch (error) {
      setState({
        kind: 'error',
        message: error instanceof Error ? error.message : t.serverError,
      });
    }
  }

  if (state.kind === 'success') {
    return (
      <div className="rfq-success-card" role="status">
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.2)',
          color: '#10b981',
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto 20px',
        }}>
          <CircleCheck style={{ width: 36, height: 36 }} />
        </div>
        <h3 style={{ fontSize: 28, fontWeight: 800, color: '#ffffff', margin: '0 0 10px' }}>
          {t.successTitle}
        </h3>
        <p style={{ color: '#cbd5e1', maxWidth: 540, margin: '0 auto 24px', fontSize: 15, lineHeight: 1.6 }}>
          {t.successSub}
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 8,
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#34d399',
        }}>
          <span>{t.refNum}</span>
          <span style={{ fontWeight: 800, color: '#ffffff' }}>{state.id}</span>
        </div>
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: 12, color: '#94a3b8' }}>
          Копію підтвердження з деталями звернення надіслано на вашу електронну адресу.
        </div>
      </div>
    );
  }

  return (
    <form className="rfq-form-card" onSubmit={submit} noValidate>
      
      {/* Target product indicator if preselected */}
      {values.selectedSeries && (
        <div className="rfq-selected-product">
          <div style={{ fontSize: 13 }}>
            <span style={{ color: '#94a3b8' }}>Обрана система BESS: </span>
            <span style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'monospace' }}>{values.selectedSeries}</span>
          </div>
          <span style={{
            fontSize: 10,
            textTransform: 'uppercase',
            fontFamily: 'monospace',
            padding: '3px 8px',
            borderRadius: 6,
            background: 'rgba(0, 102, 255, 0.2)',
            color: '#60a5fa',
            fontWeight: 700,
          }}>
            Каталог CATL
          </span>
        </div>
      )}

      {/* Group 1: Contacts */}
      <div>
        <h4 className="rfq-section-title">
          1. Контактні дані замовника
        </h4>
        <div className="rfq-grid-2">
          <Field label={t.name} name="contactPerson" required value={values.contactPerson || ''} onChange={update} placeholder="Олег Коваленко" />
          <Field label={t.company} name="companyName" required value={values.companyName || ''} onChange={update} placeholder="ТОВ «ЕнергоТех Пром»" />
          <Field label={t.email} name="email" type="email" required value={values.email || ''} onChange={update} placeholder="oleg@company.ua" />
          <Field label={t.phone} name="phone" type="tel" required value={values.phone || ''} onChange={update} placeholder="+380 (67) 123-45-67" />
        </div>
      </div>

      {/* Group 2: Location & Facility */}
      <div>
        <h4 className="rfq-section-title">
          2. Локація та тип об&apos;єкта
        </h4>
        <div className="rfq-grid-3">
          <div className="rfq-field">
            <label htmlFor="country">
              {t.country} *
            </label>
            <select
              id="country"
              name="country"
              value={values.country || 'UA'}
              onChange={update}
              className="rfq-select"
            >
              <option value="UA">Україна (UA)</option>
              <option value="PL">Польща (PL)</option>
              <option value="DE">Німеччина (DE)</option>
              <option value="RO">Румунія (RO)</option>
              <option value="OTHER">Інша країна</option>
            </select>
          </div>

          <Field
            label={t.city}
            name="location"
            value={values.location || ''}
            onChange={update}
            placeholder="м. Київ / Дніпропетровська обл."
          />

          <div className="rfq-field">
            <label htmlFor="industry">
              {t.facilityType} *
            </label>
            <select
              id="industry"
              name="industry"
              required
              value={values.industry || ''}
              onChange={update}
              className="rfq-select"
            >
              <option value="">Оберіть профіль</option>
              {t.facilities.map((fac) => (
                <option key={fac.id} value={fac.label}>
                  {fac.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Group 3: Engineering Sizing */}
      <div>
        <h4 className="rfq-section-title">
          3. Інженерні параметри системи
        </h4>
        <div className="rfq-grid-3">
          <Field
            label={t.powerKw}
            name="powerKw"
            type="number"
            value={values.powerKw || ''}
            onChange={update}
            placeholder="Наприклад: 500"
          />
          <Field
            label={t.capacityKwh}
            name="capacityKwh"
            type="number"
            value={values.capacityKwh || ''}
            onChange={update}
            placeholder="Наприклад: 1000"
          />
          <div className="rfq-field">
            <label htmlFor="timeline">
              {t.timeline}
            </label>
            <select
              id="timeline"
              name="timeline"
              value={values.timeline || '3-6_months'}
              onChange={update}
              className="rfq-select"
            >
              {t.timelines.map((tl) => (
                <option key={tl.id} value={tl.id}>
                  {tl.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Group 4: Details & Files */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="rfq-field">
          <label htmlFor="details">
            {t.details}
          </label>
          <textarea
            id="details"
            name="details"
            rows={4}
            maxLength={10000}
            value={values.details || ''}
            onChange={update}
            placeholder={t.detailsPlaceholder}
            className="rfq-textarea"
          />
        </div>

        {/* File Attachments Dropzone */}
        <div className="rfq-field">
          <label>
            {t.filesTitle}
          </label>
          
          <div
            onClick={() => fileInputRef.current?.click()}
            className="rfq-dropzone"
          >
            <UploadCloud style={{ width: 28, height: 28, color: '#38bdf8', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
              Натисніть для вибору файлів або перетягніть їх сюди
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{t.filesHint}</div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          {files.length > 0 && (
            <div className="rfq-file-list">
              {files.map((file, idx) => (
                <div key={idx} className="rfq-file-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0' }}>
                    <FileText style={{ width: 16, height: 16, color: '#38bdf8' }} />
                    <span>{file.name}</span>
                    <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>({Math.round(file.size / 1024)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                  >
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Legal checkbox */}
        <label className="rfq-legal-check">
          <input
            type="checkbox"
            required
          />
          <span>
            {t.agreement}{' '}
            <a href={`/${locale}/privacy`} style={{ color: '#38bdf8', textDecoration: 'underline' }}>
              {t.privacy}
            </a>
            .
          </span>
        </label>
      </div>

      {state.kind === 'error' && (
        <div style={{
          padding: 14,
          borderRadius: 10,
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <ShieldAlert style={{ width: 18, height: 18, flexShrink: 0, color: '#ef4444' }} />
          <span>{state.message}</span>
        </div>
      )}

      {/* Master Spec Button: "Отримати комерційну пропозицію" */}
      <button
        type="submit"
        disabled={state.kind === 'sending'}
        className="rfq-submit-btn"
      >
        <span>{state.kind === 'sending' ? t.sendingBtn : t.submitBtn}</span>
        <ArrowRight style={{ width: 16, height: 16 }} />
      </button>

      <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
        Офіційне ТКП містить розрахунок окупності (ROI), графік деградації комірок, конфігурацію контейнерів та специфікацію супутнього обладнання (PCS, EMS, ОПС).
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="rfq-field">
      <label htmlFor={name}>
        {label} {required && <span style={{ color: '#38bdf8' }}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rfq-input"
      />
    </div>
  );
}
