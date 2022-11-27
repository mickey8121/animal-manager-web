import { useCallback } from 'react';
import { useDeleteHerdMutation, DeleteHerdMutation, Herd } from 'generated/graphql';
import { FetchResult } from '@apollo/client';

import HERDS_QUERY from 'graphql/queries/herds/herds';

export type DeleteHerd = (id: string) => Promise<FetchResult<DeleteHerdMutation>>;

interface UseDeleteHerdResult {
  deleteHerd: DeleteHerd;
  loading: boolean;
}

const useDeleteHerd = (): UseDeleteHerdResult => {
  const [deleteHerdRaw, { loading }] = useDeleteHerdMutation({});

  const deleteHerd: DeleteHerd = useCallback(
    id =>
      deleteHerdRaw({
        variables: { where: { id } },
        update: (cache, { data }) => {
          if (!data?.deleteHerd) return;

          try {
            const { herds = [] } = cache.readQuery({ query: HERDS_QUERY }) ?? {};

            cache.writeQuery({
              query: HERDS_QUERY,
              data: { herds: (herds as Herd[]).filter(herd => herd.id !== id) },
            });
          } catch (error) {}
        },
      }),
    [deleteHerdRaw],
  );

  return { deleteHerd, loading };
};

export default useDeleteHerd;
