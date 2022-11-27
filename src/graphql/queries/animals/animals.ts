import { gql } from '@apollo/client';

import ANIMAL_MAIN_FRAGMENT from 'graphql/fragments/animals/animalMain';

const ANIMALS_QUERY = gql`
  query animals($where: WhereAnimalInput!, $take: Int, $skip: Int) {
    animals(where: $where, take: $take, skip: $skip) {
      nodes {
        ...animalMainFragment
      }
      totalCount
    }
  }

  ${ANIMAL_MAIN_FRAGMENT}
`;

export default ANIMALS_QUERY;
