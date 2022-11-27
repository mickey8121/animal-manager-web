import { gql } from '@apollo/client';

import HERD_FRAGMENT from 'graphql/fragments/herd';

const CREATE_HERD_MUTATION = gql`
  mutation createHerd($data: CreateHerdInput!) {
    createHerd(data: $data) {
      ...herdFragment
    }
  }

  ${HERD_FRAGMENT}
`;

export default CREATE_HERD_MUTATION;
