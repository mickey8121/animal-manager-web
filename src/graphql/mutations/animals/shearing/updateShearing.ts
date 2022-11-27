import { gql } from '@apollo/client';

import SHEARING_FRAGMENT from 'graphql/fragments/animals/shearing';

const UPDATE_SHEARING = gql`
  mutation updateShearing($data: UpdateShearingInput!, $where: WhereUniqueShearingInput!) {
    updateShearing(data: $data, where: $where) {
      ...shearingFragment
    }
  }

  ${SHEARING_FRAGMENT}
`;

export default UPDATE_SHEARING;
