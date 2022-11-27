import { gql } from '@apollo/client';

import WEIGHT_FRAGMENT from 'graphql/fragments/animals/weight';

const WEIGHTS_QUERY = gql`
  query weights(
    $where: WhereWeightInput
    $skip: Int
    $take: Int
    $cursor: WhereUniqueWeightInput
    $orderBy: [OrderByWeightInput!]
  ) {
    weights(where: $where, skip: $skip, take: $take, cursor: $cursor, orderBy: $orderBy) {
      nodes {
        ...weightFragment
      }
      pageInfo {
        hasNextPage
      }
      totalCount
    }
  }

  ${WEIGHT_FRAGMENT}
`;

export default WEIGHTS_QUERY;
