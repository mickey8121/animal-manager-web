import { gql } from '@apollo/client';

const MEDICATION_FRAGMENT = gql`
  fragment medicationFragment on Medication {
    id
    dose
    date
    notes
    reminders {
      id
      createdAt
      date
      dose
    }
    type {
      id
      name
    }
  }
`;

export default MEDICATION_FRAGMENT;
