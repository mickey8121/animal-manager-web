import { useEffect, useMemo } from 'react';

import { usePreviousDistinct } from 'react-use';

import useUpdateQuery from 'hooks/useUpdateQuery';
import useSortAnimalsByStatus from 'hooks/animals/useSortAnimalsByStatus';

import ANIMALS_SUBSCRIPTION from 'graphql/subscriptions/animals';

import { useAnimalsQuery, Maybe, AnimalStatus, Animal } from 'generated/graphql';

type UseAnimals = (props: {
  herdId?: string;
  sortByStatus?: boolean;
  isActiveOnly?: boolean;
  take?: number;
  skip?: number;
}) => {
  animals?: Maybe<Animal[]>;
  totalCount?: number;
  loading: boolean;
};

const useAnimals: UseAnimals = ({ herdId, sortByStatus, isActiveOnly, ...params }) => {
  const updateQuery = useUpdateQuery('animal', true);

  const {
    data: { animals: { nodes: animals = null, totalCount = undefined } = {} } = {},
    loading,
    subscribeToMore,
  } = useAnimalsQuery({
    variables: {
      where: { herdId },
      ...params,
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (subscribeToMore) subscribeToMore({ document: ANIMALS_SUBSCRIPTION, updateQuery });
  }, [subscribeToMore, updateQuery]);

  const sortedAnimals = useSortAnimalsByStatus(animals as Animal[]);

  const currentAnimalsList = useMemo(() => {
    if (isActiveOnly) {
      return animals?.filter(a => a.status === AnimalStatus.Active);
    }

    if (sortByStatus) return sortedAnimals;

    return animals;
  }, [animals, isActiveOnly, sortByStatus, sortedAnimals]);

  const prevTotalCount = usePreviousDistinct(totalCount);

  return {
    animals: (currentAnimalsList ?? null) as Animal[],
    totalCount: totalCount ?? prevTotalCount,
    loading,
  };
};

export default useAnimals;
