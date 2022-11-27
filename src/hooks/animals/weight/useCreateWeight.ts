import { useCallback } from 'react';

import { useParams } from 'react-router-dom';

import { FetchResult } from '@apollo/client';

import {
  CreateWeightInput,
  CreateWeightMutation,
  useCreateWeightMutation,
} from 'generated/graphql';

type CreateWeightValues = Omit<CreateWeightInput, 'animalId'> & {
  animalId?: string;
};

type CreateWeight = (values: CreateWeightValues) => Promise<FetchResult<CreateWeightMutation>>;

type UseCreateWeight = () => {
  createWeight: CreateWeight;
  loading: boolean;
};

const useCreateWeight: UseCreateWeight = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [createWeightMutation, { loading }] = useCreateWeightMutation();

  const createWeight: CreateWeight = useCallback(
    values => {
      return createWeightMutation({
        variables: { data: { animalId, ...values } },
        refetchQueries: ['weights'],
        awaitRefetchQueries: true,
      });
    },

    [animalId, createWeightMutation],
  );

  return { createWeight, loading };
};

export default useCreateWeight;
