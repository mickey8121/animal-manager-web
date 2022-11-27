import { gql } from '@apollo/client';

const BILLING_PLANS_QUERY = gql`
  query billingPlans {
    billingPlans {
      id
      name
      price
    }
  }
`;

export default BILLING_PLANS_QUERY;
