import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import useUser from 'hooks/user/useUser';

import {
  UpdateUserInput,
  useUpdateUserMutation,
  UpdateUserMutation,
  UserFragmentFragment,
} from 'generated/graphql';

type UpdateUser = (data: UpdateUserInput) => Promise<FetchResult<UpdateUserMutation>>;

interface UseUpdateUserResult {
  updateUser: UpdateUser;
  loading: boolean;
}

const useUpdateUser = (): UseUpdateUserResult => {
  const user = useUser();

  const [updateUserMutation, { loading }] = useUpdateUserMutation();

  const updateUser: UpdateUser = useCallback(
    data => {
      return updateUserMutation({
        variables: { data },

        optimisticResponse: {
          updateUser: {
            ...user,
            ...data,
          } as UserFragmentFragment,
        },
      });
    },
    [updateUserMutation, user],
  );

  return { updateUser, loading };
};

export default useUpdateUser;
