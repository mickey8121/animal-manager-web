import { useEffect } from 'react';

import useUpdateQuery from 'hooks/useUpdateQuery';

import HERDS_SUBSCRIPTION from 'graphql/subscriptions/herds';

import { useHerdsQuery, HerdFragmentFragment, Maybe } from 'generated/graphql';

interface UseHerdsResults {
  herds: Maybe<HerdFragmentFragment[]>;
  loading: boolean;
}

const useHerds = (): UseHerdsResults => {
  const updateQuery = useUpdateQuery('herd');
  const { data: { herds = null } = {}, loading, subscribeToMore } = useHerdsQuery();

  useEffect(() => {
    if (subscribeToMore) subscribeToMore({ document: HERDS_SUBSCRIPTION, updateQuery });
  }, [subscribeToMore, updateQuery]);

  return { herds, loading };
};

export default useHerds;
