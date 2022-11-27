import { FC, memo } from 'react';
import { NavLink } from 'react-router-dom';

import app from 'helpers/app';

const AppTitle: FC = () => (
  <NavLink to='/'>
    <b className='heading'>{app.appTitle}</b>
  </NavLink>
);

export default memo(AppTitle);
