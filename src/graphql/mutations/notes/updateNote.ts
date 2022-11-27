import { gql } from '@apollo/client';

import NOTE_FRAGMENT from 'graphql/fragments/note';

const UPDATE_NOTE_MUTATION = gql`
    mutation updateNote($data: UpdateNoteInput!, $where: WhereUniqueNoteInput!) {
        updateNote(data: $data, where: $where) {
            ...noteFragment
        }

        ${NOTE_FRAGMENT}
    }
`;

export default UPDATE_NOTE_MUTATION;
