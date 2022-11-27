import { useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { useSubscription } from '@apollo/client';
import { usePreviousDistinct } from 'react-use';

import SHEARINGS_SUBSCRIPTION from 'graphql/subscriptions/shearings';

import {
  Maybe,
  OrderByShearingInput,
  ShearingFragmentFragment,
  useShearingsQuery,
} from 'generated/graphql';

type UseShearings = (props?: {
  orderBy?: Maybe<OrderByShearingInput | OrderByShearingInput[]>;
  skip?: Maybe<number>;
  take?: Maybe<number>;
}) => {
  shearings?: ShearingFragmentFragment[];
  loading: boolean;
  totalCount?: number;
};

const useShearings: UseShearings = (props = {}) => {
  const { animalId } = useParams<{ animalId: string }>();

  const variables = useMemo(
    () => ({
      where: { animalId },
      ...props,
    }),
    [animalId, props],
  );

  const {
    data: { shearings: { nodes: shearings = undefined, totalCount = undefined } = {} } = {},
    loading,
    refetch,
  } = useShearingsQuery({
    variables,
    fetchPolicy: 'cache-and-network',
    returnPartialData: true,
  });

  const prevTotalCount = usePreviousDistinct(totalCount);

  useSubscription(SHEARINGS_SUBSCRIPTION, {
    variables,
    onSubscriptionData: () => void refetch(),
  });

  return { shearings, loading, totalCount: totalCount || prevTotalCount };
};

export default useShearings;
