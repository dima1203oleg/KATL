import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pimRepository } from '../../../../lib/pim/pimRepository';
import { TenerProductDetailView } from '../../../../components/TenerProductDetailView';

export const dynamic='force-dynamic';
type Props={params:Promise<{locale:string;slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {locale,slug}=await params;
 try{
  const product=await pimRepository.getProductBySlug(slug,locale);
  if(!product)return {title:'Продукт не знайдено',robots:{index:false,follow:false}};
  const languages:Record<string,string>={};
  for(const candidate of ['uk-UA','en','zh-CN']){
   try{if(await pimRepository.getProductBySlug(slug,candidate))languages[candidate]=`/${candidate}/products/${slug}`;}catch{}
  }
  return {title:product.name,description:product.shortDesc,alternates:{canonical:`/${locale}/products/${slug}`,...(Object.keys(languages).length?{languages}:{})}};
 }
 catch{return {title:'Каталог тимчасово недоступний',robots:{index:false,follow:false}};}
}

export default async function ProductDetailPage({params}:Props){
 const {locale,slug}=await params;
 if(!['uk-UA','en','zh-CN'].includes(locale))notFound();
 let product;
 try{product=await pimRepository.getProductBySlug(slug,locale);}catch{return <main className="container content-section"><div className="error-note">Каталог тимчасово недоступний. Спробуйте пізніше.</div></main>;}
 if(!product)notFound();
 return <TenerProductDetailView product={product} locale={locale}/>;
}
