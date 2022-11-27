import { gql } from '@apollo/client';

const HERD_MAIN_FRAGMENT = gql`
  fragment herdMainFragment on Herd {
    id
    name
    createdAt
  }
`;

export default HERD_MAIN_FRAGMENT;
