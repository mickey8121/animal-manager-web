import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import Modal from 'components/common/Modal';
import AnimalWeightsForm from 'components/animals/form/AnimalWeightsForm';

interface Props {
  show: boolean;
  toggle: () => void;
}

const WeightsModal: FC<Props> = ({ show, toggle }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('animals.weight.addWeight')}
      showCloseButton
      autoFocus={false}
      show={show}
      onClose={toggle}
    >
      <AnimalWeightsForm onCloseModal={toggle} />
    </Modal>
  );
};

export default WeightsModal;
