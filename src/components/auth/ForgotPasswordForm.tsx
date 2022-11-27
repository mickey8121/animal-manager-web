import { FC, useCallback, useState } from 'react';

import { useFormik, FormikProvider, Form } from 'formik';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import * as yup from 'yup';

import Button from 'components/common/buttons/Button';
import Input from 'components/common/form/Input';
import ButtonGoBack from 'components/common/buttons/ButtonGoBack';

import { email } from 'components/auth/validation';

import useGATracker from 'hooks/useGATracker';

import { useForgotPasswordMutation } from 'generated/graphql';

const ForgotPasswordForm: FC = () => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState(false);
  const [forgotPassword, { loading }] = useForgotPasswordMutation();
  const { push } = useHistory();

  const { customEvent } = useGATracker();

  const onSubmit = useCallback(
    async data => {
      try {
        const isOk = await forgotPassword({ variables: { data } });

        customEvent('method');

        setIsChecked(!!isOk);
      } catch (err) {}
    },
    [customEvent, forgotPassword],
  );

  const handleClick = useCallback(() => push('/sign-in'), [push]);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: yup.object().shape({
      email,
    }),
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form className='auth-form' id='recovery-form' onSubmit={handleSubmit} noValidate>
        <h2 className='auth-form-heading' id='recovery-form-heading'>
          {isChecked ? t('auth.checkEmail') : t('auth.forgotYourPassword')}
        </h2>
        <p className='recovery-text'>
          {isChecked ? t('auth.checkInstruction') : t('auth.recoveryMessage')}
        </p>
        {!isChecked && (
          <Input name='email' label='Email' placeholder='john@mail.com' type='email' autoFocus />
        )}
        {isChecked ? (
          <Button color='primary' className='primary' onClick={handleClick}>
            {t('common.ok')}
          </Button>
        ) : (
          <Button type='submit' color='primary' className='primary' loading={loading}>
            {t('auth.resetPassword')}
          </Button>
        )}
        {!isChecked && <ButtonGoBack color='transparent' />}
      </Form>
    </FormikProvider>
  );
};

export default ForgotPasswordForm;
