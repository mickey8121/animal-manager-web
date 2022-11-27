import { gql } from '@apollo/client';

import HERD_FRAGMENT from 'graphql/fragments/herd';

const HERDS_SUBSCRIPTION = gql`
  subscription herdsSubscription {
    herds {
      mutationType
      herd {
        ...herdFragment
      }
    }
  }

  ${HERD_FRAGMENT}
`;

export default HERDS_SUBSCRIPTION;
