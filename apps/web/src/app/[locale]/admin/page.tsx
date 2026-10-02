import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminWorkspace } from '../../../components/admin/AdminWorkspace';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Захищений контрольний центр', robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!['uk-UA', 'en', 'zh-CN'].includes(locale)) notFound();
  return <AdminWorkspace />;
}
