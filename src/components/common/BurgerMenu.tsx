import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import classnames from 'classnames';

import useDataFromProvider from 'hooks/useDataFromProvider';

const BurgerMenu: FC = () => {
  const { t } = useTranslation();
  const { active, visible, toggleSidebar } = useDataFromProvider();

  if (!visible) return null;

  return (
    <div className='burger-container'>
      <button type='button' className='burger-btn' onClick={toggleSidebar}>
        <div className='burger'>
          <div className={classnames('burger-block', { active, 'not-active': !active })}>
            <span className='burger-span' />
            <span className='burger-span' />
            <span className='burger-span' />
          </div>
        </div>
        <p className='burger-text'>{t('common.menu')}</p>
      </button>
    </div>
  );
};

export default BurgerMenu;
