import { useCallback } from 'react';

import { useParams } from 'react-router-dom';

import { FetchResult } from '@apollo/client';

import {
  CreateMedicationInput,
  CreateMedicationMutation,
  useCreateMedicationMutation,
} from 'generated/graphql';

type CreateMedication = (
  values: Omit<CreateMedicationInput, 'animalId'> & {
    animalId?: CreateMedicationInput['animalId'];
  },
) => Promise<FetchResult<CreateMedicationMutation>>;

type UseCreateMedication = () => { createMedication: CreateMedication; loading: boolean };

const useCreateMedication: UseCreateMedication = () => {
  const { animalId } = useParams<{ animalId: string }>();
  const [createMedicationRaw, { loading }] = useCreateMedicationMutation();

  const createMedication = useCallback<CreateMedication>(
    values =>
      createMedicationRaw({
        variables: { data: { animalId, ...values } },
        refetchQueries: ['medications'],
        awaitRefetchQueries: true,
      }),
    [animalId, createMedicationRaw],
  );

  return { createMedication, loading };
};

export default useCreateMedication;
