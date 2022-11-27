import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from 'components/common/Modal';

interface Props {
  show: boolean;
  title: string;
  description: string | JSX.Element;
  cancelBtnTitle?: string;
  confirmBtnTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onClosed?: () => void;
}

const ConfirmModal: FC<Props> = ({
  show,
  title,
  description,
  cancelBtnTitle,
  confirmBtnTitle,
  onCancel,
  onConfirm,
  onClosed,
}) => {
  const { t } = useTranslation();

  const cancelTitle = cancelBtnTitle || t('common.cancel');
  const confirmTitle = confirmBtnTitle || t('common.confirm');

  return (
    <Modal
      showFooter
      confirmIsDanger
      show={show}
      onClose={onCancel}
      title={title}
      cancelBtnTitle={cancelTitle}
      confirmBtnTitle={confirmTitle}
      onConfirmClick={onConfirm}
      onCancelClick={onCancel}
      onClosed={onClosed}
    >
      {description}
    </Modal>
  );
};

export default ConfirmModal;
