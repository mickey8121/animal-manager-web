import { useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { useSubscription } from '@apollo/client';
import { usePreviousDistinct } from 'react-use';

import MEDICATIONS_SUBSCRIPTION from 'graphql/subscriptions/medications';

import {
  Maybe,
  OrderByMedicationInput,
  MedicationFragmentFragment,
  useMedicationsQuery,
  MedicationOrderField,
} from 'generated/graphql';

type UseMedications = (props: {
  orderBy: OrderByMedicationInput[];
  skip?: Maybe<number>;
  take?: Maybe<number>;
}) => {
  medications?: MedicationFragmentFragment[];
  loading: boolean;
  totalCount?: number;
};

const useMedications: UseMedications = props => {
  const { animalId } = useParams<{ animalId: string }>();

  const orderBy = useMemo(() => {
    if (props.orderBy.length > 1) return props.orderBy;

    return [
      ...props.orderBy,
      {
        direction: props.orderBy[0]?.direction,
        field: MedicationOrderField.CreatedAt,
      },
    ];
  }, [props]);

  const variables = useMemo(
    () => ({
      where: { animalId },
      ...props,
      orderBy,
    }),
    [animalId, orderBy, props],
  );

  const {
    data: { medications: { nodes: medications = undefined, totalCount = undefined } = {} } = {},
    loading,
    refetch,
  } = useMedicationsQuery({
    variables,
    fetchPolicy: 'cache-and-network',
    returnPartialData: true,
  });

  const prevTotalCount = usePreviousDistinct(totalCount);

  useSubscription(MEDICATIONS_SUBSCRIPTION, {
    variables,
    onSubscriptionData: () => void refetch(),
  });

  return { medications, loading, totalCount: totalCount || prevTotalCount };
};

export default useMedications;
