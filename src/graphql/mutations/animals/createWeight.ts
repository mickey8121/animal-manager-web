import { gql } from '@apollo/client';

import WEIGHT_FRAGMENT from 'graphql/fragments/animals/weight';

const CREATE_WEIGHT_MUTATION = gql`
  mutation createWeight($data: CreateWeightInput!) {
    createWeight(data: $data) {
      ...weightFragment
    }
  }

  ${WEIGHT_FRAGMENT}
`;

export default CREATE_WEIGHT_MUTATION;
