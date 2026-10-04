import type { KatlProduct } from '@katl/shared-types';

type ProductListResponse = { data: KatlProduct[]; total: number };
type ProductResponse = { data: KatlProduct };

function apiUrl(path: string) {
  const base = process.env.API_URL || 'http://127.0.0.1:4000';
  return new URL(path, base).toString();
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path), { cache: 'no-store', headers: { accept: 'application/json' } });
  if (!response.ok) {
    const error = new Error(response.status === 404 ? 'PIM_NOT_FOUND' : `PIM_API_${response.status}`);
    Object.assign(error, { status: response.status });
    throw error;
  }
  return response.json() as Promise<T>;
}

export interface KatlDocument {
  id: string;
  title: string;
  document_type: string;
  locale: string;
  version: string;
  source_url: string;
  checksum_sha256: string;
  mime_type: string;
  size_bytes: string | number;
  product_name?: string;
}

/** The Next.js web app reads PIM data only through the canonical API. */
export const pimRepository = {
  async getAllProducts(locale = 'uk-UA', filters: { category?: string; type?: string } = {}): Promise<KatlProduct[]> {
    const params = new URLSearchParams({ locale });
    if (filters.category) params.set('category', filters.category);
    if (filters.type) params.set('type', filters.type);
    const response = await request<ProductListResponse>(`/api/v1/products?${params}`);
    return response.data;
  },

  async getProductBySlug(slug: string, locale = 'uk-UA'): Promise<KatlProduct | null> {
    const params = new URLSearchParams({ locale });
    try {
      const response = await request<ProductResponse>(`/api/v1/products/${encodeURIComponent(slug)}?${params}`);
      return response.data;
    } catch (error) {
      if ((error as Error).message === 'PIM_NOT_FOUND') return null;
      throw error;
    }
  },

  async getDocuments(locale = 'uk-UA', productId?: string): Promise<KatlDocument[]> {
    const params = new URLSearchParams({ locale });
    if (productId) params.set('product', productId);
    try {
      const response = await request<{ documents: KatlDocument[]; total: number }>(`/api/v1/documents?${params}`);
      return response.documents || [];
    } catch {
      return [];
    }
  },
};
