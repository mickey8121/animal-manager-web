import { gql } from '@apollo/client';
import NOTE_FRAGMENT from 'graphql/fragments/note';

const NOTE_QUERY = gql`
  query note($where: WhereUniqueNoteInput!) {
    note(where: $where) {
      ...noteFragment
    }
  }
  ${NOTE_FRAGMENT}
`;

export default NOTE_QUERY;
