import { gql } from '@apollo/client';

import SHEARING_FRAGMENT from 'graphql/fragments/animals/shearing';

const DELETE_SHEARING = gql`
  mutation deleteShearing($where: WhereUniqueShearingInput!) {
    deleteShearing(where: $where) {
      ...shearingFragment
    }
  }

  ${SHEARING_FRAGMENT}
`;

export default DELETE_SHEARING;
