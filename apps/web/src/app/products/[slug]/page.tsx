import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pimRepository } from '../../../lib/pim/pimRepository';
import { TenerProductDetailView } from '../../../components/TenerProductDetailView';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Server-rendered Dynamic Metadata for SEO & Social Sharing
 */
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await pimRepository.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Продукт не знайдено — CATL BESS Ukraine',
      description: 'Запитане обладнання не знайдено в каталозі PIM CATL.',
    };
  }

  const title = `${product.name} (${product.energySpecs.nominalCapacity}) — Офіційний PIM CATL Ukraine`;
  const description = `${product.shortDesc} ${product.highlight}. Сертифікація NFPA 855, UL 9540A, LFP комірки з ресурсом ${product.cellSpecs.cycleLife}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://catl-ukraine.com/products/${product.id}`,
      siteName: 'CATL BESS Ukraine Platform',
      images: [
        {
          url: '/og-catl-tener.jpg',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Server Component: Control Vertical Slice for /products/catl-tener-h
 */
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await pimRepository.getProductBySlug(slug, 'uk');

  if (!product) {
    notFound();
  }

  return <TenerProductDetailView product={product} locale="uk" />;
}
