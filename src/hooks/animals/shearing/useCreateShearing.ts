import { useCallback } from 'react';

import { useParams } from 'react-router-dom';

import { FetchResult } from '@apollo/client';

import {
  CreateShearingInput,
  CreateShearingMutation,
  useCreateShearingMutation,
} from 'generated/graphql';

type CreateShearing = (
  values: Omit<CreateShearingInput, 'animalId'> & {
    animalId?: CreateShearingInput['animalId'];
  },
) => Promise<FetchResult<CreateShearingMutation>>;

type UseCreateShearing = () => { createShearing: CreateShearing; loading: boolean };

const useCreateShearing: UseCreateShearing = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [createShearingRaw, { loading }] = useCreateShearingMutation();

  const createShearing = useCallback<CreateShearing>(
    values =>
      createShearingRaw({
        variables: { data: { animalId, ...values } },
        refetchQueries: ['shearings'],
        awaitRefetchQueries: true,
      }),
    [animalId, createShearingRaw],
  );

  return { createShearing, loading };
};

export default useCreateShearing;
