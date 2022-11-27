import { gql } from '@apollo/client';

import ANIMAL_PROFILE_FRAGMENT from 'graphql/fragments/animals/animalProfile';

const CREATE_ANIMAL_MUTATION = gql`
  mutation createAnimal($data: CreateAnimalInput!) {
    createAnimal(data: $data) {
      ...animalProfileFragment
    }
  }

  ${ANIMAL_PROFILE_FRAGMENT}
`;

export default CREATE_ANIMAL_MUTATION;
