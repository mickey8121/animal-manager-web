import { useCallback } from 'react';

import { FetchResult, useApolloClient } from '@apollo/client';
import { useParams } from 'react-router-dom';

import {
  UpdateMedicationInput,
  UpdateMedicationMutation,
  useUpdateMedicationMutation,
  MedicationType,
  Maybe,
  MedicationReminder,
} from 'generated/graphql';
import MEDICATION_FRAGMENT from 'graphql/fragments/animals/medications';
import MEDICATION_TYPES_QUERY from 'graphql/queries/animals/medications/medicationTypes';

type UpdateMedication = (props: {
  id: string;
  name: string;
  values: UpdateMedicationInput;
}) => Promise<FetchResult<UpdateMedicationMutation>>;

type UseUpdateMedication = () => {
  updateMedication: UpdateMedication;
  loading: boolean;
};

const useUpdateMedication: UseUpdateMedication = () => {
  const client = useApolloClient();
  const [updateMedicationRaw, { loading }] = useUpdateMedicationMutation();
  const { herdId } = useParams<{ herdId: string }>();

  const updateMedication = useCallback<UpdateMedication>(
    ({ values, id, name }) => {
      const medication = client.readFragment({
        fragment: MEDICATION_FRAGMENT,
        fragmentName: 'medicationFragment',
        id: `Medication:${id}`,
      });

      const { medicationTypes } =
        client.readQuery({
          query: MEDICATION_TYPES_QUERY,
          variables: { where: { herdId } },
        }) ?? {};

      const type = medicationTypes.find((item: MedicationType) => item.id === values.typeId) ?? {
        id: values.typeId,
        name,
      };
      const isReminderDefined = !!medication.reminders[0];

      const getReminders = (): Maybe<
        Pick<MedicationReminder, 'id' | 'createdAt' | 'date' | 'dose'>
      >[] => {
        if (!values.reminder) return [null];

        return [
          {
            ...medication.reminders[0],
            id: isReminderDefined ? medication.reminders[0]?.id : 'temp_id',
            createdAt: isReminderDefined ? medication.reminders[0]?.createdAt : 'temp_date',
            dose: values.reminder?.dose,
            date: values.reminder?.date,
          },
        ];
      };

      return updateMedicationRaw({
        variables: { where: { id }, data: values },

        optimisticResponse: {
          updateMedication: {
            ...medication,
            ...values,
            type,
            reminders: getReminders(),
          },
        },
      });
    },
    [client, herdId, updateMedicationRaw],
  );

  return { updateMedication, loading };
};

export default useUpdateMedication;
