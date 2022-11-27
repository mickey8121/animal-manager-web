import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import { DeleteWeightMutation, useDeleteWeightMutation } from 'generated/graphql';

export type DeleteWeight = (id: string) => Promise<FetchResult<DeleteWeightMutation>>;

type UseDeleteWeight = () => {
  deleteWeight: DeleteWeight;
  loading: boolean;
};

const useDeleteWeight: UseDeleteWeight = () => {
  const [deleteWeightMutation, { loading }] = useDeleteWeightMutation();

  const deleteWeight: DeleteWeight = useCallback(
    id =>
      deleteWeightMutation({
        variables: { where: { id } },
        refetchQueries: ['weights'],
        awaitRefetchQueries: true,
      }),

    [deleteWeightMutation],
  );

  return { deleteWeight, loading };
};

export default useDeleteWeight;
