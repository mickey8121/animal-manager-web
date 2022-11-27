import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import { Animal, CreateNoteMutation, Maybe, useCreateNoteMutation } from 'generated/graphql';

type CreateNote = (
  noteText: string,
  createdAt: string,
  animal?: Maybe<Animal>,
) => Promise<FetchResult<CreateNoteMutation>>;

interface UseCreateNote {
  createNote: CreateNote;
  loading: boolean;
}

const useCreateNote = (): UseCreateNote => {
  const [createNoteRaw, { loading }] = useCreateNoteMutation();

  const createNote: CreateNote = useCallback(
    (noteText, createdAt, animal) =>
      createNoteRaw({
        variables: {
          data: { note: noteText, animalId: animal?.id, createdAt },
        },
        refetchQueries: ['notes'],
        awaitRefetchQueries: true,
      }),
    [createNoteRaw],
  );

  return { createNote, loading };
};

export default useCreateNote;
