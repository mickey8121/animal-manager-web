import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';
import client from 'startup/apollo';

import HERD_QUERY from 'graphql/queries/herds/herd';
import HERD_FRAGMENT from 'graphql/fragments/herd';
import {
  CancelInvitationMutation,
  CancelInvitationMutationVariables,
  HerdInvitation,
  HerdQuery,
  useCancelInvitationMutation,
} from 'generated/graphql';

type CancelInvitation = (
  memberId: string,
  herdId: string,
) => Promise<FetchResult<CancelInvitationMutation>>;

interface useCancelInvitationResult {
  cancelInvitation: CancelInvitation;
  loading: boolean;
}

const useCancelInvitation = (): useCancelInvitationResult => {
  const [cancelInvitation, { loading }] = useCancelInvitationMutation();

  const handleCancelInvitation: CancelInvitation = useCallback(
    (memberId, herdId) => {
      const variables: CancelInvitationMutationVariables = {
        where: { id: memberId },
      };

      const herdFragment = client.readFragment({
        id: `Herd:${herdId}`,
        fragment: HERD_FRAGMENT,
        fragmentName: 'herdFragment',
      });

      const { recipientEmail } = herdFragment.invitations.find(
        (member: HerdInvitation) => member.id === memberId,
      );

      return cancelInvitation({
        variables,
        update: (cache, { data }) => {
          if (!data?.cancelInvitation) return;

          try {
            const herdQuery = cache.readQuery<HerdQuery>({
              query: HERD_QUERY,
              variables: {
                where: {
                  id: herdId,
                },
              },
            });

            if (!herdQuery?.herd) return;

            cache.writeQuery<HerdQuery>({
              query: HERD_QUERY,
              variables: {
                where: {
                  id: herdId,
                },
              },
              data: {
                herd: {
                  __typename: 'Herd',
                  ...herdQuery.herd,
                  invitations: herdQuery.herd.invitations.filter(member => member.id !== memberId),
                },
              },
            });
          } catch (_) {}
        },
        optimisticResponse: {
          __typename: 'Mutation',
          cancelInvitation: {
            __typename: 'HerdInvitation',
            id: memberId,
            recipientEmail,
          },
        },
      });
    },
    [cancelInvitation],
  );

  return { cancelInvitation: handleCancelInvitation, loading };
};

export default useCancelInvitation;
