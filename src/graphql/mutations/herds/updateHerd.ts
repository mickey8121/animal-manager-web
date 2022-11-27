import { gql } from '@apollo/client';

import HERD_FRAGMENT from 'graphql/fragments/herd';

const UPDATE_HERD_MUTATION = gql`
  mutation updateHerd($data: UpdateHerdInput!, $where: WhereUniqueHerdInput!) {
    updateHerd(data: $data, where: $where) {
      ...herdFragment
    }
  }

  ${HERD_FRAGMENT}
`;

export default UPDATE_HERD_MUTATION;
