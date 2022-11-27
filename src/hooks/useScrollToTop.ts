import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

// fix react-router-dom issue: scroll position from prev page on current page
const useScrollToTop = (): void => {
  const { pathname } = useLocation();

  useEffect(() => window.scroll(0, 0), [pathname]);
};

export default useScrollToTop;
