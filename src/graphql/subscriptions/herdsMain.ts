import { gql } from '@apollo/client';

import HERD_MAIN_FRAGMENT from 'graphql/fragments/herdMain';

const HERDS_MAIN_SUBSCRIPTION = gql`
  subscription herdsMainSubscription {
    herds {
      mutationType
      herd {
        ...herdMainFragment
      }
    }
  }

  ${HERD_MAIN_FRAGMENT}
`;

export default HERDS_MAIN_SUBSCRIPTION;
