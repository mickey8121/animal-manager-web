import { useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { ApolloError, useSubscription } from '@apollo/client';
import { usePreviousDistinct } from 'react-use';

import NOTES_SUBSCRIPTION from 'graphql/subscriptions/notes';

import {
  Maybe,
  NoteFragmentFragment,
  NoteOrderField,
  NotesQueryVariables,
  OrderDirection,
  useNotesQuery,
} from 'generated/graphql';

type UseNotes = (params?: { skip?: Maybe<number>; take?: Maybe<number> }) => {
  notes: Maybe<NoteFragmentFragment[]>;
  loading: boolean;
  error?: ApolloError;
  totalCount?: number;
};

interface Params {
  animalId?: string;
}

const useNotes: UseNotes = (params = {}) => {
  const { animalId } = useParams<Params>();

  const variables = useMemo(() => {
    const initial: NotesQueryVariables = {
      orderBy: { direction: OrderDirection.Desc, field: NoteOrderField.CreatedAt },
      ...params,
    };

    if (animalId) initial.where = { animalId };

    return initial;
  }, [animalId, params]);

  const { data, loading, error, refetch } = useNotesQuery({
    fetchPolicy: 'cache-and-network',
    variables,
    returnPartialData: true,
  });

  const notes = data?.notes?.nodes || null;
  const totalCount = data?.notes.totalCount;
  const prevTotalCount = usePreviousDistinct(totalCount);

  useSubscription(NOTES_SUBSCRIPTION, { variables, onSubscriptionData: () => void refetch() });

  return { notes, loading, error, totalCount: totalCount || prevTotalCount };
};

export default useNotes;
