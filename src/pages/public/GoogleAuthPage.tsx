import { FC, useEffect, memo } from 'react';

import { useHistory } from 'react-router-dom';

import Loading from 'components/common/Loading';

import useQueryParams from 'hooks/useQueryParams';
import useAuth from 'hooks/user/useAuth';
import useGATracker from 'hooks/useGATracker';

import { AuthMethod } from 'generated/graphql';

const GoogleAuthPage: FC = () => {
  const { code } = useQueryParams();
  const { push } = useHistory();

  const { customEvent } = useGATracker();

  const { signIn } = useAuth();

  useEffect(() => {
    if (code)
      signIn({ googleAccessCode: code, method: AuthMethod.Google })
        .then(() => customEvent('method'))
        .catch(() => push('sign-in'));

    // use only 'code' in deps so that the 'signIn' is not called twice
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return <Loading fullscreen />;
};

export default memo(GoogleAuthPage);
