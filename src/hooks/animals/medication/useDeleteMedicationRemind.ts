import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import {
  DeleteMedicationReminderMutation,
  useDeleteMedicationReminderMutation,
} from 'generated/graphql';

type DeleteMedicationReminder = (
  id: string,
) => Promise<FetchResult<DeleteMedicationReminderMutation>>;

type UseDeleteMedicationReminder = () => {
  deleteMedicationReminder: DeleteMedicationReminder;
  loading: boolean;
};

const useDeleteMedicationRemind: UseDeleteMedicationReminder = () => {
  const [deleteMedicationReminderRaw, { loading }] = useDeleteMedicationReminderMutation();

  const deleteMedicationReminder = useCallback<DeleteMedicationReminder>(
    id =>
      deleteMedicationReminderRaw({
        variables: { where: { id } },

        optimisticResponse: {
          deleteMedicationReminder: { __typename: 'MedicationReminder', id },
        },

        refetchQueries: ['medications'],
        awaitRefetchQueries: true,
      }),
    [deleteMedicationReminderRaw],
  );

  return { deleteMedicationReminder, loading };
};

export default useDeleteMedicationRemind;
