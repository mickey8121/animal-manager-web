import { useCallback } from 'react';
import { FetchResult, useApolloClient } from '@apollo/client';
import { useUpdateHerdMutation, UpdateHerdMutation } from 'generated/graphql';

import HERDS_QUERY from 'graphql/queries/herds/herds';
import HERD_QUERY from 'graphql/queries/herds/herd';

type UpdateHerd = (name: string, herdId: string) => Promise<FetchResult<UpdateHerdMutation>>;
interface UseUpdateHerdResult {
  updateHerd: UpdateHerd;
  loading: boolean;
}

const useUpdateHerd = (): UseUpdateHerdResult => {
  const client = useApolloClient();

  const [updateHerdRaw, { loading }] = useUpdateHerdMutation();

  const updateHerd: UpdateHerd = useCallback(
    (name, herdId) =>
      updateHerdRaw({
        variables: { data: { name }, where: { id: herdId } },
        update: (cache, { data }) => {
          if (!data?.updateHerd) return;

          const { updateHerd: herd } = data;

          const { herds = [] } = cache.readQuery({ query: HERDS_QUERY }) ?? {};

          cache.writeQuery({
            query: HERDS_QUERY,
            data: { herds: [...herds.filter(({ id }) => id !== herd.id), herd] },
          });
        },
        optimisticResponse: ({ data: { name: herdName }, where: { id } }) => {
          const { herd } = client.readQuery({ query: HERD_QUERY, variables: { where: { id } } });

          return {
            updateHerd: {
              ...herd,
              name: herdName,
            },
          };
        },
      }),
    [client, updateHerdRaw],
  );

  return { updateHerd, loading };
};

export default useUpdateHerd;
