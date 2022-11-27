import { useLocation } from 'react-router-dom';

import { camelCase } from 'lodash';

const useQueryParams = <T>(): T => {
  const result: any = {};

  const { search } = useLocation();

  const params = new URLSearchParams(search);

  params.forEach((value, key) => {
    result[camelCase(key)] = value;
  });

  return result as T;
};

export default useQueryParams;
