import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import Modal from 'components/common/Modal';
import MedicationForm from 'components/animals/medication/MedicationForm';

import { MedicationFragmentFragment, Maybe } from 'generated/graphql';

interface Props {
  show: boolean;
  toggle: () => void;
  medication?: Maybe<MedicationFragmentFragment>;
}

const MedicationModal: FC<Props> = ({ show, toggle, medication }) => {
  const { t } = useTranslation();

  return (
    <Modal
      showCloseButton
      size='lg'
      autoFocus={false}
      show={show}
      title={
        medication ? t('animals.medication.editMedication') : t('animals.medication.addMedication')
      }
      onClose={toggle}
    >
      <MedicationForm medication={medication} onCloseModal={toggle} />
    </Modal>
  );
};

export default MedicationModal;
