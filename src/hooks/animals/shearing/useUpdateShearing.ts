import { useCallback } from 'react';

import { FetchResult } from '@apollo/client';

import {
  UpdateShearingInput,
  UpdateShearingMutation,
  useUpdateShearingMutation,
} from 'generated/graphql';

type UpdateShearing = (props: {
  id: string;
  values: UpdateShearingInput;
}) => Promise<FetchResult<UpdateShearingMutation>>;

type UseUpdateShearing = () => {
  updateShearing: UpdateShearing;
  loading: boolean;
};

const useUpdateShearing: UseUpdateShearing = () => {
  const [updateShearingRaw, { loading }] = useUpdateShearingMutation();

  const updateShearing = useCallback<UpdateShearing>(
    ({ values, id }) =>
      updateShearingRaw({
        variables: { where: { id }, data: values },
      }),
    [updateShearingRaw],
  );

  return { updateShearing, loading };
};

export default useUpdateShearing;
