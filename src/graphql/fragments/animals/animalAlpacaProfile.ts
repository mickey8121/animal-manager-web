import { gql } from '@apollo/client';

const ANIMAL_ALPACA_PROFILE_FRAGMENT = gql`
  fragment animalAlpacaProfileFragment on Animal {
    profile {
      ... on AlpacaProfile {
        aanzHerdId
        aanzHerdName
        aanzIar
        aanzName
        phenotype
      }
    }
  }
`;

export default ANIMAL_ALPACA_PROFILE_FRAGMENT;
