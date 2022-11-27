import { gql } from '@apollo/client';

import MEDICATION_FRAGMENT from 'graphql/fragments/animals/medications';

const MEDICATIONS_QUERY = gql`
  query medications(
    $where: WhereMedicationInput!
    $orderBy: [OrderByMedicationInput!]
    $cursor: WhereUniqueMedicationInput
    $skip: Int
    $take: Int
  ) {
    medications(where: $where, skip: $skip, take: $take, orderBy: $orderBy, cursor: $cursor) {
      nodes {
        ...medicationFragment
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
  }

  ${MEDICATION_FRAGMENT}
`;

export default MEDICATIONS_QUERY;
