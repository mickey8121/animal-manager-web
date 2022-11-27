import { gql } from '@apollo/client';

const DELETE_NOTE_MUTATION = gql`
  mutation deleteNote($where: WhereUniqueNoteInput!) {
    deleteNote(where: $where) {
      id
    }
  }
`;

export default DELETE_NOTE_MUTATION;
