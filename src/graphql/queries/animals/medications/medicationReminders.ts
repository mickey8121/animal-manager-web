import { gql } from '@apollo/client';

const MEDICATION_REMINDERS_QUERY = gql`
  query medicationReminders(
    $where: WhereMedicationReminderInput!
    $orderBy: [OrderByMedicationReminderInput!]
  ) {
    medicationReminders(where: $where, orderBy: $orderBy) {
      id
      date
      dose
      medication {
        id
        type {
          id
          name
        }
      }
    }
  }
`;

export default MEDICATION_REMINDERS_QUERY;
