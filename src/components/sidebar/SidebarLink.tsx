import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

import classnames from 'classnames';

export interface SidebarLinkProps extends NavLinkProps {
  icon?: string;
  title: string;
}

const SidebarLink: FC<SidebarLinkProps> = ({ className, icon = '', title, ...props }) => (
  <NavLink title={title} className={classnames('sidebar-link', className)} {...props}>
    {icon && <img src={icon} className='sidebar-link-icon' alt='' />}
    <span className='sidebar-link-span'>{title}</span>
  </NavLink>
);

export default SidebarLink;
