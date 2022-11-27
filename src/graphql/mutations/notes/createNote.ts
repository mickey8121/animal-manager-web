import { gql } from '@apollo/client';

import NOTE_FRAGMENT from 'graphql/fragments/note';

const CREATE_NOTE_MUTATION = gql`
  mutation createNote($data: CreateNoteInput!) {
    createNote(data: $data) {
      ...noteFragment
    }
  }
  ${NOTE_FRAGMENT}
`;

export default CREATE_NOTE_MUTATION;
