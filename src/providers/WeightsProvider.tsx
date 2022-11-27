import { FC, createContext, useState, useEffect, useCallback } from 'react';

import { useParams } from 'react-router-dom';

import { isEqual, sortBy } from 'lodash';

import useUpdateQuery from 'hooks/useUpdateQuery';
import useDeleteWeight, { DeleteWeight } from 'hooks/animals/weight/useDeleteWeight';

import WEIGHTS_SUBSCRIPTION from 'graphql/subscriptions/weights';
import {
  useWeightsQuery,
  OrderDirection,
  WeightOrderField,
  Weight,
  Maybe,
  WeightsQuery,
} from 'generated/graphql';
import { ApolloQueryResult } from '@apollo/client';

export interface WeightsContextValue {
  pagValue: string;
  isReverse: boolean;
  onPagValueChange: (value: string) => void;
  onIsReverseChange: () => void;
  animalId?: string;
  weights: Omit<Weight, 'animal'>[] | never[];
  weightsChart: Omit<Weight, 'animal'>[] | never[];
  loading?: boolean;
  deleteLoading?: boolean;
  deleteWeight?: DeleteWeight;
  refetch: () => Maybe<Promise<ApolloQueryResult<WeightsQuery>>>;
}

export const WeightsContext = createContext<WeightsContextValue>({
  pagValue: '5',
  isReverse: false,
  onPagValueChange: () => null,
  onIsReverseChange: () => null,
  weights: [],
  weightsChart: [],
  refetch: () => null,
});

interface Params {
  animalId: string;
}

const WeightsProvider: FC = ({ children }) => {
  const [pagValue, setPagValue] = useState('5');
  const [isReverse, setIsReverse] = useState(false);
  const [weights, setWeights] = useState<WeightsContextValue['weights']>([]);
  const [weightsChart, setWeightsChart] = useState<WeightsContextValue['weights']>([]);
  const updateQuery = useUpdateQuery('weight');
  const { animalId } = useParams<Params>();

  const { data, loading, subscribeToMore, refetch } = useWeightsQuery({
    variables: {
      where: { animalId },
      take: parseInt(pagValue, 10),
      orderBy: {
        direction: isReverse ? OrderDirection.Asc : OrderDirection.Desc,
        field: WeightOrderField.Date,
      },
    },
  });
  const { deleteWeight, loading: deleteLoading } = useDeleteWeight();

  const handlePagValueChange = useCallback((value: string): void => setPagValue(value), []);

  const handleIsReverseChange = useCallback((): void => setIsReverse(!isReverse), [isReverse]);

  useEffect(() => {
    void refetch();
  }, [isReverse, refetch]);

  useEffect(() => {
    if (subscribeToMore) subscribeToMore({ document: WEIGHTS_SUBSCRIPTION, updateQuery });
  }, [subscribeToMore, updateQuery]);

  useEffect(() => {
    if (!isEqual(sortBy(weights, 'id'), sortBy(weightsChart, 'id'))) {
      if (isReverse) return setWeightsChart(weights);
      setWeightsChart([...weights].reverse());
    }
  }, [weightsChart, weights, isReverse]);

  useEffect(() => {
    if (data?.weights) setWeights(data.weights.nodes as WeightsContextValue['weights']);
  }, [data]);

  return (
    <WeightsContext.Provider
      value={{
        animalId,
        pagValue,
        isReverse,
        weights,
        loading,
        deleteLoading,
        weightsChart,
        deleteWeight,
        onIsReverseChange: handleIsReverseChange,
        onPagValueChange: handlePagValueChange,
        refetch,
      }}
    >
      {children}
    </WeightsContext.Provider>
  );
};

export default WeightsProvider;
