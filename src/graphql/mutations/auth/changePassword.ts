import { gql } from '@apollo/client';

import USER_FRAGMENT from 'graphql/fragments/user/user';

const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($data: ChangePasswordInput!) {
    changePassword(data: $data) {
      accessToken
      refreshToken
      user {
        ...userFragment
      }
    }
  }

  ${USER_FRAGMENT}
`;

export default CHANGE_PASSWORD_MUTATION;
