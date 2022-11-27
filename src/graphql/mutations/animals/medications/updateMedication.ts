import { gql } from '@apollo/client';

import MEDICATION_FRAGMENT from 'graphql/fragments/animals/medications';

const UPDATE_MEDICATION = gql`
  mutation updateMedication($data: UpdateMedicationInput!, $where: WhereUniqueMedicationInput!) {
    updateMedication(data: $data, where: $where) {
      ...medicationFragment
    }
  }

  ${MEDICATION_FRAGMENT}
`;

export default UPDATE_MEDICATION;
