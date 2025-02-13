import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { getFallbackLanguage } from './fallback';
import deepmerge from 'deepmerge';


export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  let messages = {};
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {}
  const fallbackLocale = getFallbackLanguage({ locale });
  if (fallbackLocale !== locale) {
    let messagesFallback = {};
    try {
      messagesFallback = (await import(`../../messages/${fallbackLocale}.json`)).default;
    } catch (error) {}
    messages = deepmerge(messagesFallback, messages);
  }


  return {
    locale,
    messages: messages,
  };
});