import { gql } from '@apollo/client';

import HERD_MAIN_FRAGMENT from 'graphql/fragments/herdMain';

const HERDS_MAIN_QUERY = gql`
  query herdsMain {
    herds {
      ...herdMainFragment
    }
  }

  ${HERD_MAIN_FRAGMENT}
`;

export default HERDS_MAIN_QUERY;
