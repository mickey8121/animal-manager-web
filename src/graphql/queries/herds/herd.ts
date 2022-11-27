import { gql } from '@apollo/client';

import HERD_FRAGMENT from 'graphql/fragments/herd';

const HERD_QUERY = gql`
  query herd($where: WhereUniqueHerdInput!) {
    herd(where: $where) {
      ...herdFragment
    }
  }

  ${HERD_FRAGMENT}
`;

export default HERD_QUERY;
