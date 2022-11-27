import * as yup from 'yup';

import i18n from 'startup/i18next';

import {
  datePickerFieldValidation,
  numberFieldValidation,
} from 'components/common/form/commonValidation';

const t = i18n.getFixedT(i18n.language);

const validationSchema = yup.object().shape({
  date: datePickerFieldValidation,
  dose: numberFieldValidation.required(
    t('common.fieldIsRequired', { context: t('animals.medication.doseRaw') }),
  ),
  typeId: yup.string().required(t('common.fieldIsRequired', { context: t('common.type') })),
  remindDate: yup.string().when('remind', {
    is: (value: string) => value && value.length > 0 && value !== 'none',
    then: yup
      .string()
      .required(t('common.fieldIsRequired', { context: t('common.date') }))
      .nullable(),
  }),
  nextQuantity: yup.string().when('remind', {
    is: (value: string) => value && value.length > 0 && value !== 'none',
    then: yup
      .string()
      .required(t('common.fieldIsRequired', { context: t('animals.medication.nextQuantity') })),
  }),
});

export default validationSchema;
