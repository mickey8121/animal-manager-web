import { FC, useEffect } from 'react';

import * as Sentry from '@sentry/react';

import i18n from 'startup/i18next';

import useUser from 'hooks/user/useUser';

const UserListener: FC = () => {
  const user = useUser();

  useEffect(() => {
    if (user) {
      void i18n.changeLanguage(user.language);

      Sentry.setUser({ email: user.email, id: user.id });
    }
  }, [user]);

  return null;
};

export default UserListener;
