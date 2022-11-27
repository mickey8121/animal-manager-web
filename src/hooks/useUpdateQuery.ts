import { useCallback } from 'react';

import { get, set } from 'lodash';

import { UpdateQueryFn } from '@apollo/client/core/watchQueryOptions';

import { Animal, Exact, Herd } from 'generated/graphql';

import { updateItemInArray } from 'helpers/updateArray';

type Entity = Herd | Animal;
type UseUpdateQuery = (
  entityName: string,
  wrappedWithNodes?: boolean,
) => UpdateQueryFn<any, Exact<{ [key: string]: any }>, any> | undefined;

const useUpdateQuery: UseUpdateQuery = (entityName, wrappedWithNodes = false) => {
  const pluralEntityName = `${entityName}s`;

  return useCallback(
    (prev, { subscriptionData }) => {
      const { data } = subscriptionData;

      if (!data) return prev;

      const prevPath = `${pluralEntityName}${wrappedWithNodes ? '.nodes' : ''}`;

      const getModifiedPrev = (newArray: any): any => {
        const modifiedNodes = set({}, prevPath, newArray);

        return { ...prev, ...modifiedNodes };
      };

      const mutationType = data?.[pluralEntityName]?.mutationType;
      const entity = data?.[pluralEntityName]?.[entityName];
      const prevNodes = get(prev, prevPath) ?? [];

      switch (mutationType) {
        case 'CREATED':
          return getModifiedPrev([entity, ...prevNodes.filter((e: Entity) => e.id !== entity?.id)]);
        case 'UPDATED':
          return getModifiedPrev(updateItemInArray(prevNodes, entity));
        case 'DELETED':
          return getModifiedPrev([...prevNodes.filter((e: Entity) => e.id !== entity?.id)]);

        default:
          return prev;
      }
    },
    [entityName, pluralEntityName, wrappedWithNodes],
  );
};

export default useUpdateQuery;
