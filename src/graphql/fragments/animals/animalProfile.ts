import { gql } from '@apollo/client';

import ANIMAL_MAIN_FRAGMENT from 'graphql/fragments/animals/animalMain';
import ANIMAL_ALPACA_PROFILE_FRAGMENT from 'graphql/fragments/animals/animalAlpacaProfile';

const ANIMAL_PROFILE_FRAGMENT = gql`
  fragment animalProfileFragment on Animal {
    ...animalMainFragment
    ...animalAlpacaProfileFragment

    saleDate
    fatherId
    motherId
    statusNotes
    transferredTo
  }

  ${ANIMAL_MAIN_FRAGMENT}
  ${ANIMAL_ALPACA_PROFILE_FRAGMENT}
`;

export default ANIMAL_PROFILE_FRAGMENT;
