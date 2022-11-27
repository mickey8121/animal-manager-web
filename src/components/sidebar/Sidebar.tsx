import { FC, useMemo } from 'react';

import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import CollapseWithHeader from 'components/common/CollapseWithHeader';
import BurgerMenu from 'components/common/BurgerMenu';

import SidebarLink from 'components/sidebar/SidebarLink';
import SidebarUser from 'components/sidebar/SidebarUser';
import AppTitle from 'components/sidebar/AppTitle';

import useHerdsFromProvider from 'hooks/herds/useHerdsFromProvider';
import useDataFromProvider from 'hooks/useDataFromProvider';

import { HERDS_ROUTE } from 'helpers/constants';
import app from 'helpers/app';

interface ISidebarLink {
  icon?: string;
  title: string;
  to: string;
  className?: string;
  subLinks?: Omit<ISidebarLink, 'subLinks'>[];
}

const { appName } = app;

const Sidebar: FC = () => {
  const { active, visible } = useDataFromProvider();
  const { t } = useTranslation();
  const match = useRouteMatch({
    path: `/${HERDS_ROUTE}`,
    exact: true,
  });
  const { herds } = useHerdsFromProvider();

  const links = useMemo<ISidebarLink[]>(
    () => [
      {
        icon: '/icons/barn.svg',
        title: t(`herds.${appName === 'sheep' ? 'myFlocks' : 'myHerds'}`),
        to: `/${HERDS_ROUTE}`,
        className: classnames('collapsible-links', { active: match }),
        subLinks: herds?.map(h => ({ to: `/${HERDS_ROUTE}/${h.id}`, title: h.name })),
      },
      {
        icon: '/icons/label.svg',
        title: t('herds.animalsForSale', { context: appName }),
        to: '/sale',
      },
      { icon: '/icons/notes.svg', title: t('herds.notes'), to: '/notes' },
      { icon: '/icons/admin.svg', title: t('herds.aanzAdmin'), to: '/admin' },
      { icon: '/icons/member.svg', title: t('herds.aanzPartnership'), to: '/partnership' },
      { icon: '/icons/animal.svg', title: t('herds.showConvenor'), to: '/convenor' },
      { icon: '/icons/fleece.svg', title: t('herds.fleeceManagement'), to: '/fleece' },
    ],
    [herds, match, t],
  );

  if (!visible) return null;

  return (
    <div className={classnames('sidebar', { active })}>
      <div className='sidebar-container'>
        <BurgerMenu />
        <div className='sidebar-block header'>
          <AppTitle />
        </div>
        <div className='sidebar-block body'>
          <div className='sidebar-links'>
            {links.map(({ icon, title, to, subLinks, className }) => {
              if (subLinks?.[0]) {
                return (
                  <CollapseWithHeader
                    key={to}
                    to={to}
                    icon={icon}
                    text={title}
                    className={className}
                  >
                    {subLinks.map(subLinkProps => (
                      <SidebarLink key={subLinkProps.to} {...subLinkProps} />
                    ))}
                  </CollapseWithHeader>
                );
              }

              return (
                <SidebarLink className={className} key={to} to={to} icon={icon} title={title} />
              );
            })}
          </div>
        </div>
        <div className='sidebar-block footer'>
          <SidebarUser />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
