import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { selectEntryLocale } from '../../lib/i18n/locale-routing';

export const dynamic = 'force-dynamic';
export default async function RootPage() {
  const [requestHeaders, cookieJar] = await Promise.all([headers(), cookies()]);
  // Country headers must be set/overwritten by the trusted edge/CDN in production.
  // Direct browser locale paths always win; geo routing is only used at `/`.
  // Only consume country headers written by the configured edge provider. Generic
  // client-controlled headers are deliberately ignored to prevent locale spoofing.
  const country = requestHeaders.get('x-vercel-ip-country') || requestHeaders.get('cf-ipcountry');
  const locale = selectEntryLocale({
    preference: cookieJar.get('KATL_LOCALE')?.value,
    country,
    acceptLanguage: requestHeaders.get('accept-language'),
  });
  redirect(`/${locale}`);
}
