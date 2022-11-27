import { useMemo } from 'react';
import { AnimalStatus, Animal, Maybe } from 'generated/graphql';

const useSortAnimalsByStatus = (animals: Maybe<Animal[]>): Maybe<Animal[]> =>
  useMemo(() => {
    if (!animals?.length) return null;

    return [...animals].sort((a, b) => {
      if (a.status === AnimalStatus.Active && b.status !== AnimalStatus.Active) return -1;
      if (a.status !== AnimalStatus.Active && b.status === AnimalStatus.Active) return 1;

      return 0;
    });
  }, [animals]);

export default useSortAnimalsByStatus;
