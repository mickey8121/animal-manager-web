import { useCallback } from 'react';
import { useDeleteAnimalMutation, DeleteAnimalMutation } from 'generated/graphql';
import { FetchResult } from '@apollo/client';

type DeleteAnimal = (id: string) => Promise<FetchResult<DeleteAnimalMutation>>;

interface UseDeleteAnimalResult {
  deleteAnimal: DeleteAnimal;
  loading: boolean;
}

const useDeleteAnimal = (): UseDeleteAnimalResult => {
  const [deleteAnimalRaw, { loading }] = useDeleteAnimalMutation();

  const deleteAnimal: DeleteAnimal = useCallback(
    id =>
      deleteAnimalRaw({
        variables: { where: { id } },
        refetchQueries: ['animals'],
        awaitRefetchQueries: true,
      }),
    [deleteAnimalRaw],
  );

  return { deleteAnimal, loading };
};

export default useDeleteAnimal;
