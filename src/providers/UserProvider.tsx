import { FC, createContext } from 'react';

import Loading from 'components/common/Loading';

import { useMeQuery, Maybe, UserFragmentFragment } from 'generated/graphql';

export const UserContext = createContext<Maybe<UserFragmentFragment>>(null);

const UserProvider: FC = ({ children }) => {
  const { data, loading } = useMeQuery();
  const { me = null } = data || {};

  if (loading) return <Loading fullscreen />;

  return <UserContext.Provider value={me}>{children}</UserContext.Provider>;
};

export default UserProvider;
