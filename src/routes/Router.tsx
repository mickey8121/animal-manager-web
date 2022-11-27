import { FC, CSSProperties } from 'react';

import { BrowserRouter } from 'react-router-dom';

import PublicRoutes from 'routes/PublicRoutes';
import PrivateRoutes from 'routes/PrivateRoutes';

import useUser from 'hooks/user/useUser';
import app from 'helpers/app';

const Router: FC = () => {
  const user = useUser();

  return (
    <div style={{ '--env': app.appName } as CSSProperties}>
      <BrowserRouter>{user ? <PrivateRoutes /> : <PublicRoutes />}</BrowserRouter>
    </div>
  );
};

export default Router;
