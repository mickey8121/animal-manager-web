import { useCallback } from 'react';

import { FetchResult, useApolloClient } from '@apollo/client';

import { useUpdateNoteMutation, UpdateNoteInput, UpdateNoteMutation } from 'generated/graphql';

import NOTE_FRAGMENT from 'graphql/fragments/note';

type UpdateNote = (
  data: UpdateNoteInput,
  id: string,
  createdAt: string,
) => Promise<FetchResult<UpdateNoteMutation>>;

interface UseUpdateNote {
  updateNote: UpdateNote;
  loading: boolean;
}

const useUpdateNote = (): UseUpdateNote => {
  const client = useApolloClient();
  const [updateNoteMutation, { loading }] = useUpdateNoteMutation();

  const updateNote: UpdateNote = useCallback(
    (data, id, createdAt) => {
      const note = client.readFragment({
        id: `Note:${id}`,
        fragment: NOTE_FRAGMENT,
      });

      return updateNoteMutation({
        variables: { data: { note: data.note, createdAt }, where: { id } },
        optimisticResponse: {
          __typename: 'Mutation',
          updateNote: {
            id,
            __typename: 'Note',
            createdAt,
            ...note,
            ...data,
            animal: note?.animal || null,
          },
        },
      });
    },
    [client, updateNoteMutation],
  );

  return { updateNote, loading };
};

export default useUpdateNote;
