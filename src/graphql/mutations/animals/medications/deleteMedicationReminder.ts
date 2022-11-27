import { gql } from '@apollo/client';

const DELETE_MEDICATION_REMINDER_MUTATION = gql`
  mutation deleteMedicationReminder($where: WhereUniqueMedicationReminderInput!) {
    deleteMedicationReminder(where: $where) {
      id
    }
  }
`;

export default DELETE_MEDICATION_REMINDER_MUTATION;
