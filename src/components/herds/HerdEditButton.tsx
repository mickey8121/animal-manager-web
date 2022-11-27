import { FC, useCallback, Fragment, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import Button from 'components/common/buttons/Button';

import HerdModal from 'components/herds/HerdModal/HerdModal';

import useFragmentFromCache from 'hooks/useFragmentFromCache';

import HERD_FRAGMENT from 'graphql/fragments/herd';

import { HerdFragmentFragment } from 'generated/graphql';

const HerdEditButton: FC = () => {
  const { t } = useTranslation();
  const { herdId } = useParams<{ herdId: string }>();

  const [showEditModal, setShowEditModal] = useState(false);

  const herd = useFragmentFromCache({
    fragment: HERD_FRAGMENT,
    fragmentName: 'herdFragment',
    id: `Herd:${herdId}`,
  });

  const handleToggleModal = useCallback((): void => setShowEditModal(prev => !prev), []);

  return (
    <Fragment>
      <Button className='btn-secondary btn-light' color='secondary' onClick={handleToggleModal}>
        {t('common.edit')}
      </Button>

      <HerdModal
        show={showEditModal}
        toggle={handleToggleModal}
        herd={herd as HerdFragmentFragment}
      />
    </Fragment>
  );
};

export default HerdEditButton;
