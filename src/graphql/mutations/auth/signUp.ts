import { gql } from '@apollo/client';

import USER_FRAGMENT from 'graphql/fragments/user/user';

const SIGN_UP_MUTATION = gql`
  mutation signUp($data: SignUpInput!) {
    signUp(data: $data) {
      accessToken
      refreshToken
      user {
        ...userFragment
      }
    }
  }

  ${USER_FRAGMENT}
`;

export default SIGN_UP_MUTATION;
