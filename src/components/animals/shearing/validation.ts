import * as yup from 'yup';

import i18n from 'startup/i18next';

import {
  datePickerFieldValidation,
  intNumberFieldValidation,
  numberFieldValidation,
} from 'components/common/form/commonValidation';

const t = i18n.getFixedT(i18n.language);

const validationSchema = yup.object().shape({
  coloration: yup
    .array(yup.string())
    .required(t('common.fieldIsRequired', { context: t('animals.coloration') })),
  weight: numberFieldValidation.required(
    t('common.fieldIsRequired', { context: t('animals.weight.weight') }),
  ),
  fibresPercentage: yup
    .number()
    .min(0, t('common.minValue', { value: 0 }))
    .max(100, t('common.maxValue', { value: 100 })),
  shearing: intNumberFieldValidation,
  date: datePickerFieldValidation,
});

export default validationSchema;
