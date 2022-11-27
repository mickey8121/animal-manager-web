import { gql } from '@apollo/client';

import ANIMAL_PROFILE_FRAGMENT from 'graphql/fragments/animals/animalProfile';

const UPDATE_ANIMAL_MUTATION = gql`
  mutation updateAnimal($data: UpdateAnimalInput!, $where: WhereUniqueAnimalInput!) {
    updateAnimal(data: $data, where: $where) {
      ...animalProfileFragment
      herd {
        id
      }
    }
  }

  ${ANIMAL_PROFILE_FRAGMENT}
`;

export default UPDATE_ANIMAL_MUTATION;
