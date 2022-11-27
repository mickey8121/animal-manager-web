import { gql } from '@apollo/client';

import SHEARING_FRAGMENT from 'graphql/fragments/animals/shearing';

const SHEARINGS_QUERY = gql`
  query shearings(
    $where: WhereShearingInput!
    $orderBy: [OrderByShearingInput!]
    $skip: Int
    $take: Int
  ) {
    shearings(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {
      nodes {
        ...shearingFragment
      }
      totalCount
    }
  }

  ${SHEARING_FRAGMENT}
`;

export default SHEARINGS_QUERY;
