import { FC, Fragment, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import Header from 'components/common/Header';
import ButtonGoBack from 'components/common/buttons/ButtonGoBack';
import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import withErrorBoundary from 'components/common/sentry/withErrorBoundary';
import AnimalProfileForm from 'components/animals/form/AnimalProfileForm';

import app from 'helpers/app';

const CreateAnimalPage: FC = () => {
  const { t } = useTranslation();

  const heading = useMemo(() => t('herds.createAnimal', { context: app.appName }), [t]);

  return (
    <Fragment>
      <HelmetWithTemplate title={heading} />

      <div className='page create-animal-page'>
        <Header text={heading}>
          <ButtonGoBack color='light' />
        </Header>

        <div className='page-body'>
          <AnimalProfileForm />
        </div>
      </div>
    </Fragment>
  );
};

export default withErrorBoundary(CreateAnimalPage);
