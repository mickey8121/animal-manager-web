import * as yup from 'yup';

import i18n from 'startup/i18next';

export type AuthMode = 'SIGN_IN' | 'SIGN_UP';

const t = i18n.getFixedT(i18n.language, 'auth');

export const email = yup.string().email(t('auth.emailInvalid')).required(t('auth.emailRequired'));

export const password = yup
  .string()
  .min(8, t('auth.passwordLength'))
  .required(t('auth.passwordRequired'));

const firstName = yup.string().required(t('auth.firstNameRequired'));
const lastName = yup.string().required(t('auth.lastNameRequired'));

export const schema = {
  SIGN_IN: yup.object().shape({
    email,
    password,
  }),
  SIGN_UP: yup.object().shape({
    email,
    password,
    firstName,
    lastName,
  }),
};
