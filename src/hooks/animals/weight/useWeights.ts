import { useMemo } from 'react';

import { useSubscription } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { usePreviousDistinct } from 'react-use';

import WEIGHTS_SUBSCRIPTION from 'graphql/subscriptions/weights';

import {
  Maybe,
  OrderByWeightInput,
  useWeightsQuery,
  WeightFragmentFragment,
} from 'generated/graphql';

type UseWeights = (props?: {
  orderBy?: Maybe<OrderByWeightInput | OrderByWeightInput[]>;
  skip?: Maybe<number>;
  take?: Maybe<number>;
}) => {
  weights?: WeightFragmentFragment[];
  loading: boolean;
  totalCount?: number;
};

const useWeights: UseWeights = (props = {}) => {
  const { animalId } = useParams<{ animalId: string }>();

  const variables = useMemo(
    () => ({
      where: { animalId },
      ...props,
    }),
    [animalId, props],
  );

  const {
    data: { weights: { nodes: weights = undefined, totalCount = undefined } = {} } = {},
    loading,
    refetch,
  } = useWeightsQuery({
    variables,
    fetchPolicy: 'cache-and-network',
    returnPartialData: true,
  });

  const prevTotalCount = usePreviousDistinct(totalCount);

  useSubscription(WEIGHTS_SUBSCRIPTION, {
    variables,
    onSubscriptionData: () => void refetch(),
  });

  return { weights, loading, totalCount: totalCount || prevTotalCount };
};

export default useWeights;
