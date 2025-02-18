import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales } from './locales';
import { site } from '@/constants/site';
 
export const routing = defineRouting({
  locales: locales,
  defaultLocale: site.defaultLocale,
  localePrefix: 'as-needed',
});
 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);