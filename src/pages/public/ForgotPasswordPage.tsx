import { FC, Fragment } from 'react';

import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';

import { capitalize } from 'lodash';

import HelmetWithTemplate from 'components/common/HelmetWithTemplate';

import ForgotPasswordForm from 'components/auth/ForgotPasswordForm';
import NewPasswordForm from 'components/auth/NewPasswordForm';

import app from 'helpers/app';

const ForgotPasswordPage: FC = () => {
  const { t } = useTranslation();
  const match = useRouteMatch({
    path: '/forgot-password',
    exact: true,
  });

  return (
    <Fragment>
      <HelmetWithTemplate title={t('auth.forgotPassword')} />

      <div className='page auth-page recovery'>
        <h1 className='auth-heading'>{`${capitalize(app.appName)} Manager and Registry ®`}</h1>
        {match ? <ForgotPasswordForm /> : <NewPasswordForm />}
      </div>
    </Fragment>
  );
};

export default ForgotPasswordPage;
