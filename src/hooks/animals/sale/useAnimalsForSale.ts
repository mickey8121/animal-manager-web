import { useMemo } from 'react';

import { usePreviousDistinct } from 'react-use';

import {
  AnimalForSale,
  Maybe,
  OrderByAnimaInfoInput,
  OrderByDraftInfoInput,
  useAnimalsForSaleQuery,
  WhereAnimalForSaleInput,
} from 'generated/graphql';

type UseAnimalsForSale = (params?: {
  orderBy?: { animal: OrderByAnimaInfoInput[]; draft: OrderByDraftInfoInput[] };
  skip?: Maybe<number>;
  take?: Maybe<number>;
  where?: WhereAnimalForSaleInput;
}) => {
  animalsForSale?: Maybe<Pick<AnimalForSale, 'id' | 'name' | '__typename'>>[] | null;
  loading: boolean;
  totalCount?: number;
};

const useAnimalsForSale: UseAnimalsForSale = params => {
  const variables = useMemo(() => params, [params]);

  const {
    data: {
      animalsForSale: { nodes: animalsForSale = undefined, totalCount = undefined } = {},
    } = {},
    loading,
  } = useAnimalsForSaleQuery({ variables, fetchPolicy: 'cache-and-network' });

  const prevTotalCount = usePreviousDistinct(totalCount);

  return { animalsForSale, loading, totalCount: totalCount || prevTotalCount };
};

export default useAnimalsForSale;
