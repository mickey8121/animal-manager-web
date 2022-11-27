import { gql } from '@apollo/client';

import SUBSCRIPTION_FRAGMENT from 'graphql/fragments/user/subscription';

const USER_FRAGMENT = gql`
  fragment userFragment on User {
    id
    email
    city
    country
    firstName
    lastName
    language
    breederProfile {
      bio
      email
      phone
    }
    ...subscriptionFragment
  }

  ${SUBSCRIPTION_FRAGMENT}
`;

export default USER_FRAGMENT;
