import { FC, Fragment, memo, useMemo } from 'react';

import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import capitalize from 'lodash/capitalize';

import Header from 'components/common/Header';
import HelmetWithTemplate from 'components/common/HelmetWithTemplate';

import app from 'helpers/app';

import { ReactComponent as UnderDevIcon } from 'icons/under-dev-image.svg';

const UnderDevelopmentPlug: FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const animal = capitalize(app.appName);
  const title = useMemo(() => {
    return t(`common.underDev.${pathname.replace('/', '')}`, { animal });
  }, [animal, pathname, t]);

  return (
    <Fragment>
      <HelmetWithTemplate title={title} />
      <div className='page'>
        <Header text={title} />
        <div className='page-body under-dev'>
          <div className='page-content'>
            <UnderDevIcon className='under-dev-image' />
            <h2 className='under-dev-message'>{t('common.pageIsUnderDev')}</h2>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default memo(UnderDevelopmentPlug);
