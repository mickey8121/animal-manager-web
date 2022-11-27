import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useApolloClient } from '@apollo/client';

import * as Sentry from '@sentry/react';

import Button from 'components/common/buttons/Button';

import useConfirm from 'hooks/useConfirm';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'helpers/constants';

import ME_QUERY from 'graphql/queries/users/me';

const LogoutButton: FC = () => {
  const { t } = useTranslation();
  const client = useApolloClient();

  const handleLogout = useCallback((): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    client.writeQuery({
      query: ME_QUERY,
      data: { me: null },
    });

    Sentry.configureScope(scope => scope.setUser(null));
    void client.resetStore();
  }, [client]);

  const confirm = useConfirm({
    title: t('profile.signOut'),
    description: t('profile.confirmLogout'),
  });

  const handleClick = useCallback(async () => {
    const isConfirmed = await confirm();

    if (isConfirmed) handleLogout();
  }, [confirm, handleLogout]);

  return (
    <Button className='logout-btn btn-secondary' color='light' onClick={handleClick}>
      {t('profile.logout')}
    </Button>
  );
};

export default LogoutButton;
