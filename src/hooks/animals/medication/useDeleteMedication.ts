import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import { DeleteMedicationMutation, useDeleteMedicationMutation } from 'generated/graphql';

type UseDeleteMedication = () => {
  deleteMedication: (id: string) => Promise<FetchResult<DeleteMedicationMutation>>;
  loading: boolean;
};

const useDeleteMedication: UseDeleteMedication = () => {
  const [deleteMedicationRaw, { loading }] = useDeleteMedicationMutation();

  const deleteMedication = useCallback(
    id =>
      deleteMedicationRaw({
        variables: { where: { id } },
        refetchQueries: ['medications'],
        awaitRefetchQueries: true,
      }),
    [deleteMedicationRaw],
  );

  return { deleteMedication, loading };
};

export default useDeleteMedication;
