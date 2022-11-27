import { FC, Fragment, useCallback, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { Form, useFormik, FormikProvider } from 'formik';
import { Waitlist } from 'waitlistapi';

import Input from 'components/common/form/Input';
import Button from 'components/common/buttons/Button';

import AppleButton from 'components/auth/AppleButton';
import GoogleButton from 'components/auth/GoogleButton';
import PasswordInput from 'components/auth/PasswordInput';

import useAuth from 'hooks/user/useAuth';
import useGATracker from 'hooks/useGATracker';

import { schema, AuthMode } from 'components/auth/validation';

import app from 'helpers/app';

interface AuthFormProps {
  mode: AuthMode;
}

const initialValues = {
  email: '',
  password: '',
};

const AuthForm: FC<AuthFormProps> = ({ mode }) => {
  const { t } = useTranslation();
  const { signIn, loading } = useAuth();
  const { customEvent } = useGATracker();
  const [isDirty, setIsDirty] = useState(false);

  const onSubmit = useCallback(
    ({ email, password }) => {
      signIn({ email, password })
        .then(() => customEvent('method'))
        .catch(() => null);
    },
    [customEvent, signIn],
  );

  const formik = useFormik({
    initialValues: { ...initialValues },
    validationSchema: schema[mode],
    onSubmit,
    validateOnMount: false,
    validateOnBlur: isDirty,
  });

  const { handleSubmit, dirty } = formik;

  useEffect(() => {
    setIsDirty(dirty);
  }, [dirty]);

  // signUp case
  if (mode !== 'SIGN_IN') {
    return (
      <div className='auth-form waitlist-widget '>
        <Waitlist
          api_key={app.waitlistApiKey}
          waitlist_link={app.waitlistLink}
          joinWaitlistHeading={t('auth.joinWaitlistHeading')}
          checkStatusHeading={t('auth.checkStatusHeading')}
          joinWaitlistButton={t('auth.joinWaitlistButton')}
          checkStatusButton={t('auth.checkStatusButton')}
          switchToCheckStatusLabel={t('auth.switchToCheckStatusLabel')}
          switchToCheckStatusLink={t('auth.switchToCheckStatusLink')}
          switchToJoinWaitlistLabel={t('auth.switchToJoinWaitlistLabel')}
          switchToJoinWaitlistLink={t('auth.switchToJoinWaitlistLink')}
        />
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <Form className='auth-form' onSubmit={handleSubmit}>
        <h2 className='auth-form-heading'>{t('auth.greeting')}</h2>

        <Input autoFocus name='email' label='Email' placeholder='john@mail.com' type='email' />
        <PasswordInput name='password' />

        <div className='actions'>
          <Fragment>
            <Link className='link' to='sign-up'>
              {t('auth.noAccount')}
            </Link>
            <Link className='link' to='forgot-password'>
              {t('auth.forgotPassword')}
            </Link>
          </Fragment>
        </div>
        <Button type='submit' color='primary' loading={loading} className='primary'>
          {t('auth.signIn')}
        </Button>
        <div className='divider'>
          <span className='divider-text'>{t('common.or')}</span>
        </div>
        <div className='auth-providers'>
          <AppleButton />
          <GoogleButton />
        </div>
      </Form>
    </FormikProvider>
  );
};

export default AuthForm;
