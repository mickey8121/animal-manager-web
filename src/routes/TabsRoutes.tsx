import { FC, ComponentType, useCallback } from 'react';
import { NavLink as RouterNavLink, Redirect, Route, Switch } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

import classNames from 'classnames';

export interface TabData {
  key: string;
  title: string;
  exact?: boolean;
  component: ComponentType;
}

interface Props {
  rootPath: string;
  redirect?: {
    from?: string;
    to: string;
  };
  tabsData: TabData[];
  onChange?: (data: TabData) => void;
}

const TabsRoutes: FC<Props> = ({ rootPath, redirect, tabsData, onChange }) => {
  const onChangeTab = useCallback(data => () => onChange && onChange(data), [onChange]);
  const getRoutePath = useCallback(
    (path: string): string => `${rootPath}/${path.toLowerCase()}`,
    [rootPath],
  );

  return (
    <div className={classNames('tab-list', { 'tab-list--multi': tabsData.length > 1 })}>
      <Nav tabs>
        {tabsData.map(tabData => (
          <NavItem key={`${tabData.key}-nav-item`} onClick={onChangeTab(tabData)}>
            <NavLink tag={RouterNavLink} to={tabData.key}>
              {tabData.title}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <div className='tab-content'>
        <Switch>
          {tabsData.map(({ key, component, exact = true }) => (
            <Route key={key} exact={exact} path={getRoutePath(key)} component={component} />
          ))}

          {redirect && <Redirect {...redirect} />}
        </Switch>
      </div>
    </div>
  );
};

export default TabsRoutes;
