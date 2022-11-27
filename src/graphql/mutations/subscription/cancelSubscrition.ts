import { gql } from '@apollo/client';

const CANCEL_SUBSCRIPTION_MUTATION = gql`
  mutation createCustomerPortalSession {
    createCustomerPortalSession
  }
`;

export default CANCEL_SUBSCRIPTION_MUTATION;
