import { gql } from '@apollo/client';

const DELETE_IMAGE_MUTATION = gql`
  mutation deleteImage($where: WhereUniqueImageInput!) {
    deleteImage(where: $where) {
      id
    }
  }
`;

export default DELETE_IMAGE_MUTATION;
