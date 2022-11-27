import { gql } from '@apollo/client';

const SUBSCRIPTION_FRAGMENT = gql`
  fragment subscriptionFragment on User {
    subscription {
      id
      cancelAtPeriodEnd
      currentPeriodEnd
      status
      plan {
        id
        name
        price
      }
    }
  }
`;

export default SUBSCRIPTION_FRAGMENT;
