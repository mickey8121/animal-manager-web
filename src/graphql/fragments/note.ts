import { gql } from '@apollo/client';

const NOTE_FRAGMENT = gql`
  fragment noteFragment on Note {
    id
    note
    createdAt
    animal {
      name
      id
    }
  }
`;

export default NOTE_FRAGMENT;
