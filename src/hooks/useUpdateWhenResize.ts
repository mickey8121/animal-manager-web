import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

const useUpdateWhenResize = (updateCondition: boolean): void => {
  const [, setWidth] = useState(window.innerWidth);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resizeHandler = useCallback(
    debounce(e => {
      if (updateCondition && e?.currentTarget) setWidth(e.currentTarget.innerWidth);
    }, 200),
    [updateCondition],
  );

  useEffect(() => {
    window.addEventListener('resize', resizeHandler);

    return () => window.removeEventListener('resize', resizeHandler);
  }, [resizeHandler]);
};

export default useUpdateWhenResize;
