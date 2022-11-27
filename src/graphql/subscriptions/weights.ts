import { gql } from '@apollo/client';

import WEIGHT_FRAGMENT from 'graphql/fragments/animals/weight';

const WEIGHTS_SUBSCRIPTION = gql`
  subscription weightSubscription($animalId: String) {
    weights(animalId: $animalId) {
      mutationType
      weight {
        ...weightFragment
      }
    }
  }
  ${WEIGHT_FRAGMENT}
`;

export default WEIGHTS_SUBSCRIPTION;
