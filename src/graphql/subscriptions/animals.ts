import { gql } from '@apollo/client';

import ANIMAL_MAIN_FRAGMENT from 'graphql/fragments/animals/animalMain';

const ANIMALS_SUBSCRIPTION = gql`
  subscription animalsSubscription {
    animals {
      mutationType
      animal {
        ...animalMainFragment
      }
    }
  }

  ${ANIMAL_MAIN_FRAGMENT}
`;

export default ANIMALS_SUBSCRIPTION;
