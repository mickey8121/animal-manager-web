import { FC, memo } from 'react';

import { useTranslation } from 'react-i18next';

import Modal from 'components/common/Modal';

import UploadImageModalBody from 'components/common/Image/UploadImageModalBody';

interface UploadImageModalProps {
  show: boolean;
  toggle: () => void;
}

const UploadImageModal: FC<UploadImageModalProps> = ({ show, toggle }) => {
  const { t } = useTranslation();

  return (
    <Modal
      showCloseButton
      autoFocus={false}
      show={show}
      title={t('common.uploadImage')}
      onClose={toggle}
    >
      <UploadImageModalBody toggle={toggle} />
    </Modal>
  );
};

export default memo(UploadImageModal);
