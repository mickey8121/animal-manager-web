import { gql } from '@apollo/client';

import MEDICATION_FRAGMENT from 'graphql/fragments/animals/medications';

const CREATE_MEDICATION_MUTATION = gql`
  mutation createMedication($data: CreateMedicationInput!) {
    createMedication(data: $data) {
      ...medicationFragment
    }
  }

  ${MEDICATION_FRAGMENT}
`;

export default CREATE_MEDICATION_MUTATION;
