import { gql } from '@apollo/client';
import NOTE_FRAGMENT from 'graphql/fragments/note';

const NOTES_QUERY = gql`
  query notes($skip: Int, $take: Int, $where: WhereNoteInput, $orderBy: [OrderByNoteInput!]) {
    notes(skip: $skip, take: $take, where: $where, orderBy: $orderBy) {
      nodes {
        ...noteFragment
      }
      totalCount
    }
  }
  ${NOTE_FRAGMENT}
`;

export default NOTES_QUERY;
