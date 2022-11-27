import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import app from 'helpers/app';

import {
  useCreateAnimalMutation,
  AnimalType,
  CreateAnimalMutation,
  CreateAnimalInput,
} from 'generated/graphql';
import ANIMALS_QUERY from 'graphql/queries/animals/animals';

export type CreateAnimalValues = Omit<CreateAnimalInput, 'herdId' | 'type'>;

type CreateAnimal = (
  values: CreateAnimalValues,
  herdId: string,
) => Promise<FetchResult<CreateAnimalMutation>>;

type UseCreateAnimal = () => {
  createAnimal: CreateAnimal;
  loading: boolean;
};

const useCreateAnimal: UseCreateAnimal = () => {
  const [createAnimalRaw, { loading }] = useCreateAnimalMutation();

  const createAnimal: CreateAnimal = useCallback(
    (values, herdId) =>
      createAnimalRaw({
        variables: {
          data: {
            ...values,
            herdId,
            type: app.appName?.toUpperCase() as AnimalType,
          },
        },
        update: (cache, { data }) => {
          if (!data?.createAnimal) return;

          const { createAnimal: animal } = data;

          const queryParams = {
            query: ANIMALS_QUERY,
            variables: {
              where: { herdId },
              take: 10,
              skip: 0,
            },
          };

          try {
            // write new animal to animalsQuery
            const { animals: { nodes = [], ...animalsData } = {} } =
              cache.readQuery(queryParams) ?? {};

            // query has take === 10
            if (nodes.length > 9) return;

            const updatedNodes = [...nodes, animal];

            cache.writeQuery({
              ...queryParams,
              data: {
                animals: { ...animalsData, nodes: updatedNodes, totalCount: updatedNodes.length },
              },
            });
          } catch (_) {}
        },
      }),
    [createAnimalRaw],
  );

  return { createAnimal, loading };
};

export default useCreateAnimal;
