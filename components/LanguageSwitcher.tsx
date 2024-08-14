"use client";

import {
  localeNames,
  locales,
  usePathname,
  useRouter,
  type Locale,
} from "@/i18n.config";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const changeLocale = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = (event.target as HTMLSelectElement).value as Locale;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <>
      <label
        htmlFor="locales"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        change language
      </label>
      <select
        value={locale}
        onChange={changeLocale}
        id="locales"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </>
  );
}
