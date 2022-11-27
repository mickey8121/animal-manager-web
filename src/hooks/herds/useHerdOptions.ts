import { useMemo } from 'react';

import { Option } from 'components/common/select/Select';

import useHerdsFromProvider from 'hooks/herds/useHerdsFromProvider';

interface HerdsOptionsResult {
  herdsOptions?: Option[];
  loading?: boolean;
}

const useHerdsOptions = (): HerdsOptionsResult => {
  const { herds, loading } = useHerdsFromProvider();

  const herdsOptions = useMemo(
    () =>
      herds?.reduce(
        (previous, { id, name }) => [...previous, { value: id, label: name }],
        [] as Option[],
      ),
    [herds],
  );

  return {
    herdsOptions,
    loading,
  };
};

export default useHerdsOptions;
