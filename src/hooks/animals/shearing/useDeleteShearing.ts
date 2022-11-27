import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import { DeleteShearingMutation, useDeleteShearingMutation } from 'generated/graphql';

type UseDeleteShearing = () => {
  deleteShearing: (id: string) => Promise<FetchResult<DeleteShearingMutation>>;
  loading: boolean;
};

const useDeleteShearing: UseDeleteShearing = () => {
  const [deleteShearingRaw, { loading }] = useDeleteShearingMutation();

  const deleteShearing = useCallback(
    id =>
      deleteShearingRaw({
        variables: { where: { id } },
        refetchQueries: ['shearings'],
        awaitRefetchQueries: true,
      }),
    [deleteShearingRaw],
  );

  return { deleteShearing, loading };
};

export default useDeleteShearing;
