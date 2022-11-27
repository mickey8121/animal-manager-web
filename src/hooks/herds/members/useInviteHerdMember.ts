import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import {
  InviteHerdMemberMutation,
  InviteHerdMemberMutationVariables,
  useInviteHerdMemberMutation,
} from 'generated/graphql';

type inviteHerdMember = (
  herdId: string,
  recipientEmail: string,
) => Promise<FetchResult<InviteHerdMemberMutation>>;

interface useInviteHerdMemberResult {
  inviteMember: inviteHerdMember;
  loading: boolean;
}

const useInviteHerdMember = (): useInviteHerdMemberResult => {
  const [inviteMember, { loading }] = useInviteHerdMemberMutation();

  const handleInviteHerdMember: inviteHerdMember = useCallback(
    (herdId, recipientEmail) => {
      const variables: InviteHerdMemberMutationVariables = {
        data: { herdId, recipientEmail },
      };

      return inviteMember({ variables, refetchQueries: ['herd'], awaitRefetchQueries: true });
    },
    [inviteMember],
  );

  return { inviteMember: handleInviteHerdMember, loading };
};

export default useInviteHerdMember;
