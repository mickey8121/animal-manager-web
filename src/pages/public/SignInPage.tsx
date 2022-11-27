import { FC, Fragment } from 'react';

import { useTranslation } from 'react-i18next';

import { capitalize } from 'lodash';

import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import withErrorBoundary from 'components/common/sentry/withErrorBoundary';

import SelectLanguage from 'components/auth/SelectLanguage';
import AuthForm from 'components/auth/AuthForm';

import app from 'helpers/app';

const SignInPage: FC = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <HelmetWithTemplate title={t('route.signIn')} />

      <div className='page auth-page'>
        <h1 className='auth-heading'>{`${capitalize(app.appName)} Manager and Registry ®`}</h1>
        <AuthForm mode='SIGN_IN' />
        <SelectLanguage />
      </div>
    </Fragment>
  );
};

export default withErrorBoundary(SignInPage);
