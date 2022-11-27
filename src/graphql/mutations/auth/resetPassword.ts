import { gql } from '@apollo/client';

import USER_FRAGMENT from 'graphql/fragments/user/user';

const RESET_PASSWORD_MUTATION = gql`
  mutation resetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data) {
      accessToken
      refreshToken
      user {
        ...userFragment
      }
    }
  }

  ${USER_FRAGMENT}
`;

export default RESET_PASSWORD_MUTATION;
