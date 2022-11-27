import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';
import client from 'startup/apollo';

import HERD_QUERY from 'graphql/queries/herds/herd';
import HERD_FRAGMENT from 'graphql/fragments/herd';
import {
  HerdMember,
  HerdQuery,
  RemoveMemberMutation,
  RemoveMemberMutationVariables,
  useRemoveMemberMutation,
} from 'generated/graphql';

type RemoveMember = (
  memberId: string,
  herdId: string,
) => Promise<FetchResult<RemoveMemberMutation>>;

interface useRemoveMemberResult {
  removeMember: RemoveMember;
  loading: boolean;
}

const useRemoveMember = (): useRemoveMemberResult => {
  const [removeMember, { loading }] = useRemoveMemberMutation();

  const handleRemoveMember: RemoveMember = useCallback(
    (memberId, herdId) => {
      const variables: RemoveMemberMutationVariables = {
        where: { id: memberId },
      };

      const herdFragment = client.readFragment({
        id: `Herd:${herdId}`,
        fragment: HERD_FRAGMENT,
        fragmentName: 'herdFragment',
      });

      const { email } = herdFragment.members.find(
        (member: HerdMember) => member.id === memberId,
      ).user;

      return removeMember({
        variables,
        update: (cache, { data }) => {
          if (!data?.removeMember) return;

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
                  members: herdQuery.herd.members.filter(member => member.id !== memberId),
                },
              },
            });
          } catch (_) {}
        },
        optimisticResponse: {
          __typename: 'Mutation',
          removeMember: {
            __typename: 'HerdMember',
            id: memberId,
            user: {
              email,
            },
          },
        },
      });
    },
    [removeMember],
  );

  return { removeMember: handleRemoveMember, loading };
};

export default useRemoveMember;
