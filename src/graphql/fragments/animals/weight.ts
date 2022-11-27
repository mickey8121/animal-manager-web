import { gql } from '@apollo/client';

const WEIGHT_FRAGMENT = gql`
  fragment weightFragment on Weight {
    id
    change
    date
    weight
  }
`;

export default WEIGHT_FRAGMENT;
