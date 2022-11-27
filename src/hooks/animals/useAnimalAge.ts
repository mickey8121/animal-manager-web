import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'lodash';
import { differenceInYears, differenceInMonths, isValid } from 'date-fns';

const useAnimalAge = (animalBirthday: string, deathDate?: string): string => {
  const { t } = useTranslation();

  const currentDate = useMemo(() => (deathDate ? new Date(deathDate) : new Date()), [deathDate]);

  const birthDate = useMemo(() => new Date(animalBirthday), [animalBirthday]);

  const yearsDiff = useMemo(
    () => differenceInYears(currentDate, birthDate),
    [currentDate, birthDate],
  );

  const monthsDiff = useMemo(
    () => differenceInMonths(currentDate, birthDate) - yearsDiff * 12,
    [currentDate, yearsDiff, birthDate],
  );

  const age = useMemo(() => {
    const yearsDiffEndOf = Number(yearsDiff.toString().slice(-1));
    const yearsTranslateOption =
      yearsDiffEndOf === 1 ? 0 : yearsDiffEndOf > 1 && yearsDiffEndOf < 5 ? 1 : 2;
    const monthsTranslateOption = monthsDiff < 5 ? 0 : 1;

    const yearsRes =
      yearsDiff &&
      (yearsDiff === 1
        ? t('animals.age.year')
        : t(`animals.age.years_${yearsTranslateOption}`, { count: yearsDiff }));

    const monthsRes =
      monthsDiff &&
      (monthsDiff === 1
        ? t('animals.age.month')
        : t(`animals.age.months_${monthsTranslateOption}`, { count: monthsDiff }));

    if (yearsRes) {
      if (monthsRes) return `${yearsRes} ${t('common.and')} ${monthsRes}`;

      return yearsRes;
    }

    if (monthsRes) return monthsRes;

    return t('animals.age.lessMonth');
  }, [t, monthsDiff, yearsDiff]);

  if (animalBirthday && isValid(birthDate)) return capitalize(`${age} ${t('animals.age.old')}`);

  return '';
};

export default useAnimalAge;
