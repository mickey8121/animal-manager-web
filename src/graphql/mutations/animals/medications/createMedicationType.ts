import { gql } from '@apollo/client';

const CREATE_MEDICATION_TYPE_MUTATION = gql`
  mutation createMedicationType($data: CreateMedicationTypeInput!) {
    createMedicationType(data: $data) {
      id
      name
    }
  }
`;

export default CREATE_MEDICATION_TYPE_MUTATION;
