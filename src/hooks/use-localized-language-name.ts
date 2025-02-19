import { useLocale } from "next-intl";
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { capitalize } from "lodash";

export const useLocalizedLanguageName = (locales: string[]) => {
	const currentLocale = useLocale();
	
	const iso6391 = new Intl.DisplayNames([currentLocale], { type: 'language' });

	return locales.map(locale => {
		const [ iso_639_1 ] = locale.split('-');
		return ({
			language: locale,
			iso_639_1: capitalize(iso6391.of(iso_639_1)),
			flag: getUnicodeFlagIcon(iso_639_1)
		});
	});
};