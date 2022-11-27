import { useCallback } from 'react';

import upperCase from 'lodash/upperCase';

import { FetchResult } from '@apollo/client';

import app from 'helpers/app';

import {
  useCreateHerdMutation,
  AnimalType,
  CreateHerdMutation,
  HerdFragmentFragment,
} from 'generated/graphql';

import HERDS_QUERY from 'graphql/queries/herds/herds';

type CreateHerd = (name: string) => Promise<FetchResult<CreateHerdMutation>>;

interface UseCreateHerdResult {
  createHerd: CreateHerd;
  loading: boolean;
}

const useCreateHerd = (): UseCreateHerdResult => {
  const [createHerdRaw, { loading }] = useCreateHerdMutation();

  const createHerd: CreateHerd = useCallback(
    name =>
      createHerdRaw({
        variables: { data: { name, type: upperCase(app.appName) as AnimalType } },
        update: (cache, { data }) => {
          if (!data?.createHerd) return;

          const { createHerd: herd } = data;

          try {
            const { herds = [] } = cache.readQuery({ query: HERDS_QUERY }) ?? {};

            cache.writeQuery({
              query: HERDS_QUERY,
              data: { herds: [...herds.filter(({ id }) => id !== herd.id), herd] },
            });
          } catch (_) {}
        },
        optimisticResponse: {
          createHerd: {
            __typename: 'Herd',
            id: 'temp_id',
            name,
            createdAt: new Date().toString(),
            members: [],
            images: [],
            invitations: [],
            animals: [],
          } as HerdFragmentFragment,
        },
      }),
    [createHerdRaw],
  );

  return { createHerd, loading };
};

export default useCreateHerd;
