import * as yup from 'yup';

import i18n from 'startup/i18next';

const t = i18n.getFixedT(i18n.language);

export const numberFieldValidation = yup
  .number()
  .min(0, t('common.minValue', { value: 0 }))
  .max(9999, t('common.maxLength', { count: 4 }));

export const intNumberFieldValidation = numberFieldValidation.integer(t('common.onlyInt'));

export const datePickerFieldValidation = yup
  .string()
  .required(t('common.fieldIsRequired', { context: t('common.date') }))
  .nullable();
