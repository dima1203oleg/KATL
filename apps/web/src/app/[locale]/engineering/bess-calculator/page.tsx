import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BessCalculator } from '../../../../components/BessCalculator';

export const metadata:Metadata={title:'BESS Calculator — попередня оцінка потужності та енергії',description:'Розрахуйте потрібні потужність і запас енергії за параметрами навантаження та тривалості.'};
export default async function BessCalculatorPage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(locale!=='uk-UA')notFound();return <main><section className="page-hero"><div className="container"><div className="breadcrumbs">Інженерія　/　BESS Calculator</div><div className="eyebrow">ПОПЕРЕДНЯ ТЕХНІЧНА ОЦІНКА</div><h1>Розрахунок потужності й енергії BESS</h1><p>Оцініть базову енергію як добуток потужності на тривалість. Резерв задається окремо. Результат не включає втрати, власне споживання та дерейтінг системи.</p></div></section><section className="content-section"><div className="container"><BessCalculator locale={locale}/></div></section></main>}
