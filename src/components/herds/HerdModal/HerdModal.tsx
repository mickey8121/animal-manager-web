import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'components/common/Modal';
import HerdModalForm from 'components/herds/HerdModal/HerdModalForm';

import app from 'helpers/app';

import { HerdFragmentFragment } from 'generated/graphql';

interface Props {
  show: boolean;
  herd?: HerdFragmentFragment;
  toggle: () => void;
}

const HerdModal: FC<Props> = ({ show, toggle, herd }) => {
  const { t } = useTranslation();

  return (
    <Modal
      showCloseButton
      autoFocus={false}
      show={show}
      title={t(`herds.${herd ? 'editHerd' : 'createHerd'}`, { context: app.appName })}
      onClose={toggle}
    >
      <HerdModalForm herd={herd} toggle={toggle} />
    </Modal>
  );
};

export default HerdModal;
