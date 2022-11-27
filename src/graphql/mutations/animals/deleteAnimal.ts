import { gql } from '@apollo/client';

const DELETE_ANIMAL_MUTATION = gql`
  mutation deleteAnimal($where: WhereUniqueAnimalInput!) {
    deleteAnimal(where: $where) {
      id
    }
  }
`;

export default DELETE_ANIMAL_MUTATION;
