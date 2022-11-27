import { FC, useMemo } from 'react';
import classnames from 'classnames';
import {
  Modal as ReactstrapModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from 'reactstrap';

import Button from 'components/common/buttons/Button';

type Handler = () => Promise<any> | void;

interface Props extends Exclude<ModalProps, 'isOpen' | 'toggle'> {
  show: boolean;
  onClose: () => void;

  title?: string;
  titleComponent?: React.ReactNode;

  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  confirmBtnTitle?: string;
  cancelBtnTitle?: string;

  cancelIsDanger?: boolean;
  confirmIsDanger?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showCloseButton?: boolean;
  borderedHeader?: boolean;
  borderedFooter?: boolean;

  onConfirmClick?: Handler;
  onCancelClick?: Handler;
}

const Modal: FC<Props> = ({
  title = '',
  titleComponent,
  children,
  className,
  headerClassName: customHeaderClassName,
  footerClassName: customFooterClassName,
  confirmBtnTitle = 'Confirm',
  cancelBtnTitle = 'Cancel',

  show,
  cancelIsDanger = false,
  confirmIsDanger = false,
  showHeader = true,
  showFooter = false,
  hideCancel = false,
  showCloseButton = true,
  borderedHeader = false,
  borderedFooter = false,
  loading = false,
  centered = true,

  onClose,
  onConfirmClick,
  onCancelClick,

  ...props
}) => {
  const modalProps = useMemo(
    () => ({
      isOpen: show,
      toggle: onClose,
      centered,
      unmountOnClose: true,
      className: classnames('custom-modal', className),
      ...props,
    }),
    [onClose, show, centered, className, props],
  );

  const headerClassName = classnames('custom-modal-header', customHeaderClassName, {
    bordered: borderedHeader,
  });
  const footerClassName = classnames('custom-modal-footer', customFooterClassName, {
    bordered: borderedFooter,
  });

  const cancelHandler = async (): Promise<void> => {
    if (onCancelClick) await onCancelClick();

    onClose();
  };

  const confirmHandler = async (): Promise<void> => {
    if (onConfirmClick) await onConfirmClick();

    onClose();
  };

  const renderCancelBtn = (): React.ReactNode => {
    if (hideCancel) return null;

    const cancelBtnClassNames = classnames('btn', { 'danger-btn': cancelIsDanger });

    return (
      <Button
        className={cancelBtnClassNames}
        onClick={cancelHandler}
        color={cancelIsDanger ? 'danger' : 'light'}
      >
        {cancelBtnTitle}
      </Button>
    );
  };

  const renderConfirmBtn = (): React.ReactNode => {
    const confirmBtnClassNames = classnames('btn', {
      'danger-btn': confirmIsDanger,
      'btn-primary': !confirmIsDanger,
    });

    return (
      <Button
        className={confirmBtnClassNames}
        onClick={confirmHandler}
        color='primary'
        loading={loading}
      >
        {confirmBtnTitle}
      </Button>
    );
  };

  return (
    <ReactstrapModal {...modalProps}>
      {showHeader && (
        <ModalHeader
          className={headerClassName}
          toggle={showCloseButton ? cancelHandler : undefined}
        >
          {titleComponent || title}
        </ModalHeader>
      )}

      {children && <ModalBody>{children}</ModalBody>}

      {showFooter && (
        <ModalFooter className={footerClassName}>
          {renderCancelBtn()}
          {renderConfirmBtn()}
        </ModalFooter>
      )}
    </ReactstrapModal>
  );
};

export default Modal;
