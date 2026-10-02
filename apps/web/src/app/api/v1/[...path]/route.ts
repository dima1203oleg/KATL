import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const apiBase = process.env.API_URL || 'http://127.0.0.1:4000';
  const target = new URL(`/api/v1/${path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`, apiBase);
  const headers = new Headers();
  for (const name of ['accept', 'content-type', 'cookie', 'x-request-id']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const method = request.method;
  const body = ['GET', 'HEAD'].includes(method) ? undefined : await request.arrayBuffer();
  const upstream = await fetch(target, { method, headers, body, cache: 'no-store', redirect: 'manual' });
  const responseHeaders = new Headers();
  for (const name of ['content-type', 'cache-control', 'x-request-id', 'retry-after']) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  const setCookie = upstream.headers.get('set-cookie');
  if (setCookie) responseHeaders.set('set-cookie', setCookie);
  return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
