import { FC } from 'react';

import classNames from 'classnames';

import DataProvider from 'providers/DataProvider';

import Sidebar from 'components/sidebar/Sidebar';
import BurgerMenu from 'components/common/BurgerMenu';

import useSidebar from 'hooks/useSidebar';

const Layout: FC = ({ children }) => {
  const { visible, active, toggleSidebar } = useSidebar();

  return (
    <div className='layout'>
      <DataProvider value={{ visible, active, toggleSidebar }}>
        <Sidebar />
        <div className={classNames('layout-content', { 'sidebar-hidden': !visible })}>
          <BurgerMenu />
          {children}
        </div>
      </DataProvider>
    </div>
  );
};

export default Layout;
