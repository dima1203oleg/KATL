import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pimRepository } from '../../../../lib/pim/pimRepository';
import { TenerProductDetailView } from '../../../../components/TenerProductDetailView';
import { KatlLocale } from '@katl/shared-types';

interface LocaleProductPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: LocaleProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await pimRepository.getProductBySlug(slug, locale as KatlLocale);

  if (!product) {
    return {
      title: 'Product Not Found — CATL BESS',
    };
  }

  const title = `${product.name} — CATL BESS [${locale.toUpperCase()}]`;
  const description = `${product.shortDesc} ${product.highlight}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: {
        uk: `/uk/products/${slug}`,
        en: `/en/products/${slug}`,
        'zh-CN': `/zh-cn/products/${slug}`,
      },
    },
  };
}

export default async function LocaleProductDetailPage({ params }: LocaleProductPageProps) {
  const { locale, slug } = await params;
  const validLocales = ['uk', 'en', 'zh-cn'];

  if (!validLocales.includes(locale.toLowerCase())) {
    notFound();
  }

  const product = await pimRepository.getProductBySlug(slug, locale as KatlLocale);

  if (!product) {
    notFound();
  }

  return <TenerProductDetailView product={product} locale={locale} />;
}
