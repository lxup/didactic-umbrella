import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales } from './locales';
 
export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
});
 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);