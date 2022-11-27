import { gql } from '@apollo/client';

const SHEARINGS_SUBSCRIPTION = gql`
  subscription shearingsSubscription {
    shearings {
      mutationType
    }
  }
`;

export default SHEARINGS_SUBSCRIPTION;
