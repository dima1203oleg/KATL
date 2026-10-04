import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pimRepository } from '../../../../lib/pim/pimRepository';
import { ProductDetail } from '../../../../components/product/ProductDetail';
import { JsonLd, breadcrumbLd } from '../../../../components/seo/JsonLd';
import { BRAND } from '../../../../lib/brand';

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
 let documents: import('../../../../lib/pim/pimRepository').KatlDocument[] = [];
 try{
   product=await pimRepository.getProductBySlug(slug,locale);
   if(product) {
     documents = await pimRepository.getDocuments(locale, product.id);
   }
 }catch{return <main className="container content-section"><div className="error-note">Каталог тимчасово недоступний. Спробуйте пізніше.</div></main>;}
 if(!product)notFound();
 const home=locale==='en'?'Home':locale==='zh-CN'?'首页':'Головна';
 const catalog=locale==='en'?'Catalog':locale==='zh-CN'?'产品目录':'Каталог';
 const productLd={'@context':'https://schema.org','@type':'Product','name':product.name,'description':product.shortDesc,'category':product.category,
  'brand':{'@type':'Brand','name':'CATL'},'manufacturer':{'@type':'Organization','name':'CATL'},
  'image':`${BRAND.siteUrl}/design/products/${encodeURIComponent(product.id)}.webp`,'url':`${BRAND.siteUrl}/${locale}/products/${encodeURIComponent(product.id)}`};
 return <><JsonLd data={productLd}/><JsonLd data={breadcrumbLd([[home,`/${locale}`],[catalog,`/${locale}/products`],[product.name,`/${locale}/products/${encodeURIComponent(product.id)}`]])}/><ProductDetail product={product} locale={locale} documents={documents}/></>;
}
