import { gql } from '@apollo/client';

const DELETE_HERD_MUTATION = gql`
  mutation deleteHerd($where: WhereUniqueHerdInput!) {
    deleteHerd(where: $where) {
      id
    }
  }
`;

export default DELETE_HERD_MUTATION;
