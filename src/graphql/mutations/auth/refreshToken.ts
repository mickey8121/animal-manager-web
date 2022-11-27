import { gql } from '@apollo/client';

const REFRESH_TOKEN_MUTATION = gql`
  mutation refreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

export default REFRESH_TOKEN_MUTATION;
