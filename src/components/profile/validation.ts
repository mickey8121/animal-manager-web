import * as yup from 'yup';

import i18n from 'startup/i18next';

export type AuthMode = 'PROFILE' | 'BREEDER';

const t = i18n.getFixedT(i18n.language, ['auth', 'profile']);

const phoneRegExp = /^[\d ()+-]+$/;

const firstName = yup.string().min(2, t('auth.firstNameLength'));
const lastName = yup.string().min(2, t('auth.lastNameLength'));
const city = yup.string().min(2, t('profile.cityLength'));
const country = yup.string().min(2, t('profile.countryLength'));
const language = yup.string();

const email = yup.string().email(t('auth.emailInvalid')).required(t('auth.emailRequired'));
const phone = yup
  .string()
  .matches(phoneRegExp, t('profile.contactPhoneInvalid'))
  .min(6, t('common.minLength', { count: 6 }))
  .max(20, t('common.maxLength', { count: 20 }));

const schema = {
  profile: yup.object().shape({
    firstName,
    lastName,
    city,
    country,
    language,
  }),
  breeder: yup.object().shape({
    email,
    phone,
  }),
};

export default schema;
