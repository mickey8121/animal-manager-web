import { FC, Fragment, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import Button from 'components/common/buttons/Button';
import Loading from 'components/common/Loading';
import HerdModal from 'components/herds/HerdModal/HerdModal';
import withErrorBoundary from 'components/common/sentry/withErrorBoundary';
import EmptyMessage from 'components/common/EmptyMessage';
import HerdsList from 'components/herds/HerdsList';

import useHerds from 'hooks/herds/useHerds';

import app from 'helpers/app';

import { Herd } from 'generated/graphql';

const HerdsPage: FC = () => {
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);

  const { herds, loading } = useHerds();

  const myHerdsTitle = useMemo(
    () => t(`herds.${app.appName === 'sheep' ? 'myFlocks' : 'myHerds'}`),
    [t],
  );

  const isHerdsExists = useMemo(() => !!herds?.length, [herds]);

  if (!herds) {
    if (loading) return <Loading page />;

    return null;
  }

  const toggleModalShow = (): void => setModalShow(!modalShow);

  return (
    <Fragment>
      <HelmetWithTemplate title={myHerdsTitle} />

      <HerdModal show={modalShow} toggle={toggleModalShow} />

      <div className='page herds-page'>
        <div className='header'>
          <h1 className='heading'>{myHerdsTitle}</h1>
          {isHerdsExists && (
            <Button className='create-btn' color='primary' onClick={toggleModalShow}>
              <span className='create-btn-text'>
                {t('herds.createHerd', { context: app.appName })}
              </span>
            </Button>
          )}
        </div>
        <div className='page-body'>
          {isHerdsExists ? (
            <HerdsList herds={herds as Herd[]} />
          ) : (
            <EmptyMessage
              message={t('herds.emptyHerdsMessage')}
              hint={t('herds.emptyHerdsHint', { context: app.appName })}
            >
              <Button className='create-btn empty' color='primary' onClick={toggleModalShow}>
                <span className='create-btn-text'>
                  {t('herds.createHerd', { context: app.appName })}
                </span>
              </Button>
            </EmptyMessage>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default withErrorBoundary(HerdsPage);
