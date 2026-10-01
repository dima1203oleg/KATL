/**
 * Production URL Router & History API Controller
 * Provides real URL paths (/products, /products/catl-tener-h, /compare?products=..., etc.)
 * with browser Back/Forward navigation, locale prefixes, and query parameters.
 */

import { useState, useEffect, useCallback } from 'react';
import { KatlPage } from '../components/katl/KatlNavbar';

export interface RouteState {
  page: KatlPage;
  productId: string;
  compareProductIds: string[];
  locale: 'uk' | 'en' | 'zh-cn';
  subSlug?: string;
  isRfqRoute: boolean;
}

export const parseLocation = (): RouteState => {
  if (typeof window === 'undefined') {
    return {
      page: 'home',
      productId: 'catl-tener-h',
      compareProductIds: ['catl-tener-h', 'catl-tener-s'],
      locale: 'uk',
      isRfqRoute: false,
    };
  }

  const rawPath = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);

  // Extract locale prefix if present (/uk/, /en/, /zh-cn/)
  let locale: 'uk' | 'en' | 'zh-cn' = 'uk';
  let path = rawPath;

  if (path.startsWith('/en')) {
    locale = 'en';
    path = path.slice(3);
  } else if (path.startsWith('/zh-cn') || path.startsWith('/zh')) {
    locale = 'zh-cn';
    path = path.replace(/^\/zh(-cn)?/, '');
  } else if (path.startsWith('/uk')) {
    locale = 'uk';
    path = path.slice(3);
  }

  if (!path.startsWith('/')) path = '/' + path;
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  // Default values
  let page: KatlPage = 'home';
  let productId = 'catl-tener-h';
  let subSlug: string | undefined;
  let isRfqRoute = false;

  // Comparison products from search params: ?products=catl-tener-h,catl-tener-s
  let compareProductIds = ['catl-tener-h', 'catl-tener-s'];
  const prodParam = searchParams.get('products');
  if (prodParam) {
    const list = prodParam.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length > 0) compareProductIds = list;
  }

  if (path === '/' || path === '') {
    page = 'home';
  } else if (path === '/products' || path === '/catalog') {
    page = 'catalog';
  } else if (path.startsWith('/products/')) {
    page = 'product';
    productId = path.replace('/products/', '');
  } else if (path === '/compare') {
    page = 'compare';
  } else if (path === '/solutions' || path.startsWith('/solutions/')) {
    page = 'solutions';
    if (path.startsWith('/solutions/')) subSlug = path.replace('/solutions/', '');
  } else if (path === '/industries' || path.startsWith('/industries/')) {
    page = 'industries';
    if (path.startsWith('/industries/')) subSlug = path.replace('/industries/', '');
  } else if (path === '/safety' || path === '/technology') {
    page = 'safety';
  } else if (path === '/tech' || path.startsWith('/engineering')) {
    page = 'tech';
  } else if (path === '/partners') {
    page = 'partners';
  } else if (path === '/customer') {
    page = 'customer';
  } else if (path === '/admin') {
    page = 'admin';
  } else if (path === '/rfq') {
    page = 'home';
    isRfqRoute = true;
  }

  return {
    page,
    productId,
    compareProductIds,
    locale,
    subSlug,
    isRfqRoute,
  };
};

export const useAppRouter = () => {
  const [route, setRoute] = useState<RouteState>(parseLocation);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback(
    (
      target: {
        page?: KatlPage;
        productId?: string;
        compareProductIds?: string[];
        subSlug?: string;
        path?: string;
      }
    ) => {
      let targetPath = '/';

      if (target.path) {
        targetPath = target.path;
      } else if (target.page === 'catalog') {
        targetPath = '/products';
      } else if (target.page === 'product') {
        targetPath = `/products/${target.productId || route.productId || 'catl-tener-h'}`;
      } else if (target.page === 'compare') {
        const pIds = target.compareProductIds || route.compareProductIds;
        targetPath = `/compare?products=${pIds.join(',')}`;
      } else if (target.page === 'solutions') {
        targetPath = target.subSlug ? `/solutions/${target.subSlug}` : '/solutions';
      } else if (target.page === 'industries') {
        targetPath = target.subSlug ? `/industries/${target.subSlug}` : '/industries';
      } else if (target.page === 'safety') {
        targetPath = '/safety';
      } else if (target.page === 'tech') {
        targetPath = '/engineering';
      } else if (target.page === 'partners') {
        targetPath = '/partners';
      } else if (target.page === 'customer') {
        targetPath = '/customer';
      } else if (target.page === 'admin') {
        targetPath = '/admin';
      } else {
        targetPath = '/';
      }

      if (window.location.pathname + window.location.search !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }

      setRoute(parseLocation());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [route.productId, route.compareProductIds]
  );

  return {
    route,
    navigateTo,
  };
};
