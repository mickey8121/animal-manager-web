import { useCallback } from 'react';

import { FetchResult, useApolloClient } from '@apollo/client';

import ANIMAL_QUERY from 'graphql/queries/animals/animal';

import {
  useUpdateAnimalMutation,
  UpdateAnimalInput,
  UpdateAnimalMutation,
} from 'generated/graphql';

export type UpdateAnimalValues = Omit<UpdateAnimalInput, 'type'>;

type UpdateAnimal = (
  values: UpdateAnimalValues,
  id: string,
) => Promise<FetchResult<UpdateAnimalMutation>>;

type UseUpdateAnimal = () => {
  updateAnimal: UpdateAnimal;
  loading: boolean;
};

const useUpdateAnimal: UseUpdateAnimal = () => {
  const client = useApolloClient();

  const [updateAnimalMutation, { loading }] = useUpdateAnimalMutation();

  const updateAnimal: UpdateAnimal = useCallback(
    (data, id) => {
      const { animal } = client.readQuery({
        query: ANIMAL_QUERY,
        variables: { where: { id } },
      });

      return updateAnimalMutation({
        variables: { data, where: { id } },

        optimisticResponse: {
          updateAnimal: {
            ...animal,
            ...data,
          },
        },
      });
    },

    [client, updateAnimalMutation],
  );

  return { updateAnimal, loading };
};

export default useUpdateAnimal;
