import { gql } from '@apollo/client';

const GENERATE_GOOGLE_AUTH_URL_MUTATION = gql`
  mutation generateGoogleAuthUrl {
    generateGoogleAuthUrl
  }
`;

export default GENERATE_GOOGLE_AUTH_URL_MUTATION;
