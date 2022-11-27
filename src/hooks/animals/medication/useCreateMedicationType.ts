import { useCallback } from 'react';

import { useParams } from 'react-router-dom';

import { FetchResult } from '@apollo/client';

import { CreateMedicationTypeMutation, useCreateMedicationTypeMutation } from 'generated/graphql';

type CreateMedicationType = (name: string) => Promise<FetchResult<CreateMedicationTypeMutation>>;

type UseCreateMedicationType = () => {
  createMedicationType: CreateMedicationType;
  loading: boolean;
};

const useCreateMedicationType: UseCreateMedicationType = () => {
  const { herdId } = useParams<{ herdId: string }>();
  const [createMedicationTypeRaw, { loading }] = useCreateMedicationTypeMutation();

  const createMedicationType = useCallback<CreateMedicationType>(
    name =>
      createMedicationTypeRaw({
        variables: { data: { herdId, name } },
        refetchQueries: ['medications'],
        awaitRefetchQueries: true,
      }),
    [createMedicationTypeRaw, herdId],
  );

  return { createMedicationType, loading };
};

export default useCreateMedicationType;
