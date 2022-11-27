import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import {
  DeleteNoteMutation,
  useDeleteNoteMutation,
  OrderDirection,
  NoteOrderField,
  NotesQueryVariables,
} from 'generated/graphql';

type DeleteNote = (id: string, animalId: string | null) => Promise<FetchResult<DeleteNoteMutation>>;

interface useDeleteNoteResult {
  deleteNote: DeleteNote;
  loading: boolean;
}

const useDeleteNote = (): useDeleteNoteResult => {
  const [deleteNote, { loading }] = useDeleteNoteMutation();

  const handleDeleteNote: DeleteNote = useCallback(
    (id, animalId = '') => {
      const variables: NotesQueryVariables = {
        orderBy: {
          direction: OrderDirection.Desc,
          field: NoteOrderField.CreatedAt,
        },
      };

      if (animalId) variables.where = { animalId: animalId || '' };

      return deleteNote({
        variables: { where: { id } },
        refetchQueries: ['notes'],
        awaitRefetchQueries: true,
      });
    },
    [deleteNote],
  );

  return { deleteNote: handleDeleteNote, loading };
};

export default useDeleteNote;
