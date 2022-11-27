import { useMemo, useCallback } from 'react';
import { isValid, format } from 'date-fns/esm';
import { enGB as en, fr, ru, de, nl } from 'date-fns/locale';

import { Language } from 'helpers/constants';

import useUser from 'hooks/user/useUser';

type FormatDate = (date: Date | string, customPattern?: string) => string | null;

interface UseFormatResult {
  formatDate: FormatDate;
  localePattern: string;
  localeDateFnsPattern: string;
  firstWeekContainsDate?: number;
  weekStartsOn?: number;
}

export const locales = { en, fr, ru, de, nl };
export const patterns: { [key: string]: string } = {
  en: 'DD/MM/YYYY',
  fr: 'DD/MM/YYYY',
  ru: 'DD.MM.YYYY',
  de: 'DD.MM.YYYY',
  nl: 'DD-MM-YYYY',
};

const useFormat = (): UseFormatResult => {
  const { language = 'en' } = useUser() ?? {};

  const locale = useMemo(() => locales[language as Language], [language]);
  const defaultDateFnsPattern = useMemo(
    () => locale.formatLong?.date({ width: 'short' }) ?? 'dd/MM/yyyy',
    [locale.formatLong],
  );
  const defaultPattern = useMemo(() => patterns[language] ?? 'DD/MM/YYYY', [language]);

  const formatDate: FormatDate = useCallback(
    (date, pattern = defaultDateFnsPattern) => {
      const parsedDate = new Date(date);

      if (!isValid(parsedDate)) return null;

      return format(parsedDate, pattern, { locale });
    },
    [defaultDateFnsPattern, locale],
  );

  return {
    formatDate,
    localePattern: defaultPattern,
    localeDateFnsPattern: defaultDateFnsPattern,
    ...locale.options,
  };
};

export default useFormat;
