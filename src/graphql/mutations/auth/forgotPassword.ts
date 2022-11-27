import { gql } from '@apollo/client';

const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($data: ForgotPasswordInput!) {
    forgotPassword(data: $data)
  }
`;

export default FORGOT_PASSWORD_MUTATION;
