import { FC, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { toast } from 'react-hot-toast';

import Button from 'components/common/buttons/Button';

import useConfirm from 'hooks/useConfirm';
import useDeleteHerd from 'hooks/herds/useDeleteHerd';
import useFragmentFromCache from 'hooks/useFragmentFromCache';
import useAnimals from 'hooks/animals/useAnimals';

import app from 'helpers/app';

import HERD_FRAGMENT from 'graphql/fragments/herd';

interface Props {
  toggle?: () => void;
}

const DeleteHerdButton: FC<Props> = ({ toggle }) => {
  const { t } = useTranslation();
  const { push } = useHistory();
  const { herdId } = useParams<{ herdId: string }>();

  const { animals } = useAnimals({ herdId });

  const { deleteHerd } = useDeleteHerd();

  const herd = useFragmentFromCache({
    fragment: HERD_FRAGMENT,
    fragmentName: 'herdFragment',
    id: `Herd:${herdId}`,
  });

  const confirm = useConfirm({
    title: t('herds.deleteHerd', { context: app.appName }),
    description: `${t('herds.deleteHerdConfirm', { context: app.appName })}. ${t(
      'common.deleteConfirm',
    )}`,
  });

  const handleDeleteAnimal = useCallback(async (): Promise<void | string> => {
    if (!herd) return toast.error(t('common.notFound'));

    if (animals?.length) return toast.error(t('herds.deleteHerbWarning', { context: app.appName }));

    toggle?.();

    const isConfirmed = await confirm();

    if (!isConfirmed && toggle) return toggle();

    try {
      await toast.promise(deleteHerd(herdId), {
        loading: t('common.deleting'),
        success: t('herds.successHerdDeleted', { context: app.appName, name: herd?.name }),
        error: t('common.errorDelete'),
      });

      return push('/herds');
    } catch (err) {}
  }, [herd, t, animals?.length, toggle, confirm, deleteHerd, herdId, push]);

  return (
    <Button className='btn btn-secondary' color='light' onClick={handleDeleteAnimal}>
      {t('herds.deleteHerd', { context: app.appName })}
    </Button>
  );
};

export default DeleteHerdButton;
