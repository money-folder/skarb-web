import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, i18n } from './locales';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // remove the default locale from the URL
  if (pathname.startsWith(`/${DEFAULT_LOCALE}/`) || pathname === `/${DEFAULT_LOCALE}`) {
    return NextResponse.redirect(
      new URL(
        pathname.replace(`/${DEFAULT_LOCALE}`, pathname === `/${DEFAULT_LOCALE}` ? '/' : ''),
        request.url,
      ),
    );
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.rewrite(
      new URL(`/${DEFAULT_LOCALE}${pathname}${request.nextUrl.search}`, request.nextUrl.href),
    );
  }
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
