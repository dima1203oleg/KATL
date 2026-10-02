import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LcosCalculator } from '../../../../components/LcosCalculator';

export const metadata: Metadata = {
  title: 'Калькулятор LCOS для BESS',
  description: 'Оцініть дисконтовану вартість відпущеної енергії BESS за власними CAPEX, OPEX та експлуатаційними припущеннями.',
};

export default async function LcosPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'uk-UA') notFound();
  return <main>
    <section className="page-hero"><div className="container">
      <div className="breadcrumbs">Інженерія　/　LCOS</div>
      <div className="eyebrow">ЕКОНОМІЧНА ОЦІНКА З ВАШИМИ ВХІДНИМИ ДАНИМИ</div>
      <h1>Калькулятор LCOS</h1>
      <p>Розрахунок враховує CAPEX, річний OPEX, енергію на цикл, цикли, деградацію, ефективність і дисконтування. Введені значення не є цінами чи характеристиками CATL.</p>
    </div></section>
    <section className="content-section"><div className="container"><LcosCalculator /></div></section>
  </main>;
}
