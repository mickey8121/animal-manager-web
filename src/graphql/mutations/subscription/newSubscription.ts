import { gql } from '@apollo/client';

const NEW_SUBSCRIPTION_MUTATION = gql`
  mutation createCheckoutSession($data: CreateCheckoutSessionInput!) {
    createCheckoutSession(data: $data)
  }
`;

export default NEW_SUBSCRIPTION_MUTATION;
