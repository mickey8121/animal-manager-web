import { FC, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Button from 'components/common/buttons/Button';

import useUser from 'hooks/user/useUser';

import app from 'helpers/app';
import { BREEDER } from 'helpers/constants';

const PopupGetAccess: FC = () => {
  const { push } = useHistory();
  const user = useUser();

  const { t } = useTranslation();

  const handleClick = useCallback((): void => push('/account'), [push]);

  if (user?.subscription?.plan.name.toLowerCase() === `${app.appName} ${BREEDER}`) return null;

  return (
    <div className='popup-access'>
      <div className='popup-access-container'>
        <h3 className='popup-access-title'>{t('common.getAccess')}</h3>
        <p className='popup-access-text'>{t('profile.tryPlan', { context: app.appName })}</p>
      </div>
      <Button className='btn-arrow btn-primary' onClick={handleClick} color='primary'>
        &rarr;
      </Button>
    </div>
  );
};

export default PopupGetAccess;
