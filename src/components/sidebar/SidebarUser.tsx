import { FC } from 'react';

import Avatar from 'react-avatar';
import { NavLink } from 'react-router-dom';

import useUserName from 'hooks/user/useUserName';

const SidebarUser: FC = () => {
  const userName = useUserName();

  return (
    <NavLink to='/profile' className='sidebar-user'>
      <Avatar className='avatar' src='' name={userName} size='46' round='10px' />
      <div className='user-info'>
        <p className='user-name'>{userName}</p>
      </div>
    </NavLink>
  );
};

export default SidebarUser;
