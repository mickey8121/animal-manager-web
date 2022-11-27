import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { differenceInCalendarMonths } from 'date-fns';

import { Option } from 'components/common/select/Select';
import { MedicationFragmentFragment, Maybe } from 'generated/graphql';

interface UseRemindOptionsResult {
  remindOptions: Option[];
  currentRemind?: string;
}

export const dateOptions = ['1', '2', '6', '12'];

const useRemindOptions = (
  medication?: Maybe<MedicationFragmentFragment>,
): UseRemindOptionsResult => {
  const { t } = useTranslation();

  const currentRemind = useMemo(() => {
    if (!medication?.reminders[0]?.date) return;

    const difference = differenceInCalendarMonths(
      new Date(medication.reminders[0].date),
      new Date(medication.reminders[0].createdAt),
    );

    if (dateOptions.includes(`${difference}`)) return `${difference}`;

    return 'customDate';
  }, [medication]);

  const remindOptions = useMemo(
    () =>
      [
        { label: t('animals.medication.remindOptions.inMonth', { item: '1' }), value: '1' },
        {
          label: t('animals.medication.remindOptions.inMonths', { item: '2', ruEnding: 'а' }),
          value: '2',
        },
        {
          label: t('animals.medication.remindOptions.inMonths', { item: '6', ruEnding: 'ев' }),
          value: '6',
        },
        { label: t('animals.medication.remindOptions.12'), value: '12' },
        { label: t('common.customDate'), value: 'customDate' },
        { label: t('animals.medication.remindOptions.none'), value: 'none' },
      ] as Option[],
    [t],
  );

  return { remindOptions, currentRemind };
};

export default useRemindOptions;
