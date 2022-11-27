import { gql } from '@apollo/client';

const MEDICATIONS_SUBSCRIPTION = gql`
  subscription medicationsSubscription {
    medications {
      mutationType
    }
  }
`;

export default MEDICATIONS_SUBSCRIPTION;
