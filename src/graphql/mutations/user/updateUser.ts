import { gql } from '@apollo/client';

import USER_FRAGMENT from 'graphql/fragments/user/user';

const UPDATE_USER_MUTATION = gql`
  mutation updateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      ...userFragment
    }
  }

  ${USER_FRAGMENT}
`;

export default UPDATE_USER_MUTATION;
