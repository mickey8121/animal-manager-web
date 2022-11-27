import { gql } from '@apollo/client';

import SHEARING_FRAGMENT from 'graphql/fragments/animals/shearing';

const CREATE_SHEARING = gql`
  mutation createShearing($data: CreateShearingInput!) {
    createShearing(data: $data) {
      ...shearingFragment
    }
  }

  ${SHEARING_FRAGMENT}
`;

export default CREATE_SHEARING;
