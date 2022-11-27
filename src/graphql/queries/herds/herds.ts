import { gql } from '@apollo/client';

import HERD_FRAGMENT from 'graphql/fragments/herd';

const HERDS_QUERY = gql`
  query herds {
    herds {
      ...herdFragment
    }
  }

  ${HERD_FRAGMENT}
`;

export default HERDS_QUERY;
