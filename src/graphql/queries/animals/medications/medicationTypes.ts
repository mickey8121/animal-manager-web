import { gql } from '@apollo/client';

const MEDICATION_TYPES_QUERY = gql`
  query medicationTypes($where: WhereMedicationTypesInput) {
    medicationTypes(where: $where) {
      id
      name
    }
  }
`;

export default MEDICATION_TYPES_QUERY;
