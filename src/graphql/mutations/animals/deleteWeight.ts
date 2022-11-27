import { gql } from '@apollo/client';

const DELETE_WEIGHT_MUTATION = gql`
  mutation deleteWeight($where: WhereUniqueWeightInput!) {
    deleteWeight(where: $where) {
      id
    }
  }
`;

export default DELETE_WEIGHT_MUTATION;
