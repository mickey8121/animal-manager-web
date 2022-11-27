import { gql } from '@apollo/client';

const DELETE_MEDICATION_MUTATION = gql`
  mutation deleteMedication($where: WhereUniqueMedicationInput!) {
    deleteMedication(where: $where) {
      id
    }
  }
`;

export default DELETE_MEDICATION_MUTATION;
