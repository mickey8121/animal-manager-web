import { gql } from '@apollo/client';

import ANIMAL_PROFILE_FRAGMENT from 'graphql/fragments/animals/animalProfile';

const ANIMAL_QUERY = gql`
  query animal($where: WhereUniqueAnimalInput!) {
    animal(where: $where) {
      ...animalProfileFragment
      herd {
        id
        members {
          id
          role
          user {
            id
          }
        }
      }
    }
  }

  ${ANIMAL_PROFILE_FRAGMENT}
`;

export default ANIMAL_QUERY;
