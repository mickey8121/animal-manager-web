import { gql } from '@apollo/client';

import USER_FRAGMENT from 'graphql/fragments/user/user';

const SIGN_IN_MUTATION = gql`
  mutation signIn($data: SignInInput!) {
    signIn(data: $data) {
      accessToken
      refreshToken
      user {
        ...userFragment
      }
    }
  }

  ${USER_FRAGMENT}
`;

export default SIGN_IN_MUTATION;
