import { useEffect } from 'react';

import useUpdateQuery from 'hooks/useUpdateQuery';

import HERDS_MAIN_SUBSCRIPTION from 'graphql/subscriptions/herdsMain';

import { Herd, useHerdsMainQuery } from 'generated/graphql';

type Herds = Pick<Herd, 'id' | 'name' | '__typename'>[] | null;

interface UseHerdsResults {
  herds: Herds;
  loading: boolean;
}

const useHerdsMain = (): UseHerdsResults => {
  const updateQuery = useUpdateQuery('herd');
  const { data: { herds = null } = {}, loading, subscribeToMore } = useHerdsMainQuery();

  useEffect(() => {
    if (subscribeToMore) subscribeToMore({ document: HERDS_MAIN_SUBSCRIPTION, updateQuery });
  }, [subscribeToMore, updateQuery]);

  return { herds, loading };
};

export default useHerdsMain;
