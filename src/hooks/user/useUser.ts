import { useContext } from 'react';

import { UserFragmentFragment, Maybe } from 'generated/graphql';

import { UserContext } from 'providers/UserProvider';

type UserHook = Maybe<UserFragmentFragment>;

const useUser = (): UserHook => useContext(UserContext);

export default useUser;
