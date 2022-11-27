import * as yup from 'yup';

import i18n from 'startup/i18next';

import {
  intNumberFieldValidation,
  numberFieldValidation,
} from 'components/common/form/commonValidation';

const t = i18n.getFixedT(i18n.language);

export const animalProfileValidationSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, t('animals.form.animalNameLength'))
    .required(t('animals.form.animalNameRequired')),
  birthday: yup
    .string()
    .min(4, t('animals.form.birthdayRequired'))
    .required(t('animals.form.birthdayRequired'))
    .nullable(true),
  animalId: intNumberFieldValidation,
  motherId: intNumberFieldValidation,
  fatherId: intNumberFieldValidation,
});

export const weightsValidationSchema = yup.object().shape({
  weight: numberFieldValidation.required(t('animals.form.weightRequired')),
});
