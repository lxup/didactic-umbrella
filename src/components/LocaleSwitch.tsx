'use client';

import { Fragment, useTransition } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { CheckIcon, ChevronDownIcon, GlobeIcon, XIcon } from "lucide-react";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { routing, usePathname, useRouter } from "@/lib/i18n/routing";
import { useLocalizedLanguageName } from "@/hooks/use-localized-language-name";
import { useLocale, useTranslations } from "next-intl";
import { upperCase } from "lodash";
import { useParams } from "next/navigation";

const LocaleSwitch = () => {
	const locale = useLocale();
	const t = useTranslations('common');
	const router = useRouter();
	const pathname = usePathname();
  	const params = useParams();
	const locales = useLocalizedLanguageName(routing.locales);
	const [isPending, startTransition] = useTransition();

	const onLocaleChange = (locale: string) => {
		const nextLocale = locale;
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale }
			);
		});
	};
	return (
		<Fragment>
			<div className="hidden sm:block">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
					<Button variant="outline" className="flex items-center gap-2">
						<GlobeIcon className="h-5 w-5" />
						<span>{upperCase(locale)}</span>
						<ChevronDownIcon className="h-4 w-4" />
					</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						{locales.map((item) => (
							<DropdownMenuItem
							key={item.language}
							className="flex items-center justify-between"
							onSelect={() => onLocaleChange(item.language)}
							disabled={isPending}
							>
								<span>{item.flag} {item.iso_639_1}</span>
								{locale === item.language && <CheckIcon className="h-5 w-5" />}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="sm:hidden">
				<Drawer>
					<DrawerTrigger asChild>
						<Button variant="outline" className="flex items-center gap-2">
						<GlobeIcon className="h-5 w-5" />
						<span>{upperCase(locale)}</span>
						<ChevronDownIcon className="h-4 w-4" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className="grid gap-4 p-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium">{t('select_language')}</h3>
							<DrawerClose asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<XIcon className="h-5 w-5" />
							</Button>
							</DrawerClose>
						</div>
						<div className="grid gap-2">
							{locales.map((item) => (
								<Button
								key={item.language}
								variant="ghost"
								className="justify-start gap-2"
								onClick={() => onLocaleChange(item.language)}
								disabled={isPending}
								>
									<span>{item.flag} {item.iso_639_1}</span>
									{locale === item.language && <CheckIcon className="h-5 w-5 ml-auto" />}
								</Button>
							))}
							{/* <Button variant="ghost" className="justify-start gap-2">
							<GlobeIcon className="h-5 w-5" />
							<span>English</span>
							<CheckIcon className="h-5 w-5 ml-auto" />
							</Button>
							<Button variant="ghost" className="justify-start gap-2">
							<GlobeIcon className="h-5 w-5" />
							<span>Español</span>
							</Button>
							<Button variant="ghost" className="justify-start gap-2">
							<GlobeIcon className="h-5 w-5" />
							<span>Français</span>
							</Button>
							<Button variant="ghost" className="justify-start gap-2">
							<GlobeIcon className="h-5 w-5" />
							<span>Deutsch</span>
							</Button> */}
						</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>
		</Fragment>
	)
};

export default LocaleSwitch;