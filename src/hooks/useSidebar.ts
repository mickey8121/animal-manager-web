import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';

interface UseSidebarResult {
  toggleSidebar: () => void;
  active: boolean;
  visible: boolean;
}

const useSidebar = (): UseSidebarResult => {
  const location = useLocation();
  const routeMatch = useRouteMatch({
    path: '/account',
    exact: true,
  });

  const [active, setActive] = useState(false);

  const visible = useMemo(() => !routeMatch, [routeMatch]);

  const toggleSidebar = useCallback(() => setActive(!active), [active]);
  const handleClick = useCallback((event: MouseEvent) => {
    if (event.pageX > 324 && event.view && event.view.innerWidth > 575) setActive(false);
  }, []);

  useEffect(() => setActive(false), [location]);
  useEffect(() => {
    window.addEventListener('click', handleClick);

    if (!active) window.removeEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [active, handleClick]);

  return { toggleSidebar, active, visible };
};

export default useSidebar;
