import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import useFragmentFromCache from 'hooks/useFragmentFromCache';

import ANIMAL_MAIN_FRAGMENT from 'graphql/fragments/animals/animalMain';

import { useAnimalQuery, Maybe, Animal } from 'generated/graphql';

type UseAnimal = (animalId?: string) => {
  animal?: Maybe<Animal>;
  loading?: boolean;
};

const useAnimal: UseAnimal = id => {
  const { animalId: animalIdFromParams } = useParams<{ animalId?: string }>();
  const animalId = useMemo(() => id || animalIdFromParams, [id, animalIdFromParams]);

  const animalShort = useFragmentFromCache({
    id: `Animal:${animalId}`,
    fragment: ANIMAL_MAIN_FRAGMENT,
  });

  const { data: { animal } = {}, loading } = useAnimalQuery({
    variables: { where: { id: animalId || '' } },
  });

  const returnableData = {
    loading,
    animal: animal as Animal,
  };

  if (animalId) returnableData.animal = (animal || animalShort || null) as Animal;

  return returnableData;
};

export default useAnimal;
