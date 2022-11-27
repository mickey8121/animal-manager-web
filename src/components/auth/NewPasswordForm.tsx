import { FC, useCallback } from 'react';

import { useFormik, FormikProvider, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import * as yup from 'yup';

import Button from 'components/common/buttons/Button';
import PasswordInput from 'components/auth/PasswordInput';
import { password as passwordSchema } from 'components/auth/validation';

import useGATracker from 'hooks/useGATracker';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'helpers/constants';

import { useResetPasswordMutation } from 'generated/graphql';
import ME_QUERY from 'graphql/queries/users/me';

const NewPasswordForm: FC = () => {
  const { t } = useTranslation();
  const [resetPassword, { loading }] = useResetPasswordMutation();
  const location = useLocation();

  const { customEvent } = useGATracker();

  const token = new URLSearchParams(location.search.substring(1)).get('reset_token') ?? '';

  const onSubmit = useCallback(
    ({ password }) => {
      void resetPassword({
        variables: {
          data: { password, token },
        },
        update: (cache, { data: response }) => {
          if (!response?.resetPassword) return;

          const { user, accessToken, refreshToken } = response.resetPassword;

          if (accessToken) {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

            cache.writeQuery({
              query: ME_QUERY,
              data: { me: user },
            });
          }

          if (accessToken && refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        },
      }).then(() => customEvent('method'));
    },
    [customEvent, resetPassword, token],
  );

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: yup.object().shape({
      password: passwordSchema,
      confirmPassword: yup.string().when('password', {
        is: (val: string) => val && val.length > 0,
        then: yup.string().oneOf([yup.ref('password')], t('auth.passwordTheSame')),
      }),
    }),
    onSubmit,
    validateOnMount: false,
    validateOnBlur: true,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form
        className='auth-form'
        id='recovery-form'
        onSubmit={handleSubmit}
        noValidate
        autoComplete='off'
      >
        <h2 className='auth-form-heading' id='recovery-form-heading'>
          {t('auth.createPassword')}
        </h2>
        <p className='recovery-text'>{t('auth.createPasswordText')}</p>
        <PasswordInput name='password' />
        <PasswordInput name='confirmPassword' />
        <Button color='primary' className='primary' type='submit' loading={loading}>
          {t('common.ok')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default NewPasswordForm;
