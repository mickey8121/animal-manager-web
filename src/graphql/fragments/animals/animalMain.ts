import { gql } from '@apollo/client';

const ANIMAL_MAIN_FRAGMENT = gql`
  fragment animalMainFragment on Animal {
    id
    animalId
    name
    sex
    birthday
    deathDate
    coloration
    status

    images {
      id
      name
      thumbUrl
      url
      updatedAt
    }
  }
`;

export default ANIMAL_MAIN_FRAGMENT;
