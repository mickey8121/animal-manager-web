import { gql } from '@apollo/client';

import ANIMAL_PROFILE_FRAGMENT from 'graphql/fragments/animals/animalProfile';

const ANIMAL_PROFILE_QUERY = gql`
  query animalProfile($where: WhereUniqueAnimalInput!) {
    animal(where: $where) {
      ...animalProfileFragment
    }
  }

  ${ANIMAL_PROFILE_FRAGMENT}
`;

export default ANIMAL_PROFILE_QUERY;
