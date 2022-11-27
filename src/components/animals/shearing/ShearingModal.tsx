import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import Modal from 'components/common/Modal';

import ShearingForm from 'components/animals/shearing/ShearingForm';

import { ShearingFragmentFragment, Maybe } from 'generated/graphql';

interface Props {
  show: boolean;
  toggle: () => void;
  shearing?: Maybe<ShearingFragmentFragment>;
}

const ShearingModal: FC<Props> = ({ show, toggle, shearing }) => {
  const { t } = useTranslation();

  return (
    <Modal
      showCloseButton
      size='lg'
      autoFocus={false}
      show={show}
      className='shearing-modal'
      title={shearing ? t('animals.shearing.editShearing') : t('animals.shearing.addShearing')}
      onClose={toggle}
    >
      <ShearingForm shearing={shearing} onCloseModal={toggle} />
    </Modal>
  );
};

export default ShearingModal;
