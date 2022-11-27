import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { Maybe, SaleFragmentFragment, useAnimalForSaleQuery } from 'generated/graphql';

interface Params {
  id: string;
}

type AnimalForSale = () => {
  animalForSale?: Maybe<SaleFragmentFragment>;
  loading: boolean;
};

const useAnimalForSale: AnimalForSale = () => {
  const { id } = useParams<Params>();

  const variables = useMemo(
    () => ({
      where: { id },
    }),
    [id],
  );

  const { data: { animalForSale } = {}, loading } = useAnimalForSaleQuery({ variables });

  return { animalForSale, loading };
};

export default useAnimalForSale;
