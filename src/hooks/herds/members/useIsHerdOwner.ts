import { useCallback } from 'react';

import useUser from 'hooks/user/useUser';

import { Herd, HerdMemberRole } from 'generated/graphql';

type UseIsHerdOwner = () => (herd: Herd) => boolean;

const useIsHerdOwner: UseIsHerdOwner = () => {
  const user = useUser();

  return useCallback(
    herd =>
      !!herd?.members?.find(({ role, user: { id: userId } }) => {
        return user?.id === userId && role === HerdMemberRole.Owner;
      }),
    [user?.id],
  );
};

export default useIsHerdOwner;
