import { FC, createContext, useState, useCallback } from 'react';

import ConfirmModal from 'components/common/ConfirmModal';

import { Maybe } from 'graphql/jsutils/Maybe';

export interface ConfirmModalOptions {
  title: string;
  description: string | JSX.Element;
  cancelBtnTitle?: string;
  confirmBtnTitle?: string;
}

interface ConfirmModalOptionsWithOnConfirm extends ConfirmModalOptions {
  onConfirm: () => void;
  onClosed: () => void;
  onCancel: () => void;
}

type ConfirmContext = Maybe<(options: ConfirmModalOptionsWithOnConfirm) => void>;

export const ConfirmContext = createContext<ConfirmContext>(null);

const initialModalOptions: ConfirmModalOptionsWithOnConfirm = {
  title: '',
  description: '',
  onConfirm: () => null,
  onCancel: () => null,
  onClosed: () => null,
};

const ConfirmProvider: FC = ({ children }) => {
  const [modalOptions, setModalOptions] = useState(initialModalOptions);
  const [show, setShow] = useState(false);

  const onClosed = useCallback((): void => {
    modalOptions.onClosed();
    setModalOptions(initialModalOptions);
  }, [modalOptions]);

  const showModal = useCallback((options: ConfirmModalOptionsWithOnConfirm): void => {
    setModalOptions(options);
    setShow(true);
  }, []);

  const onCancel = useCallback((): void => {
    modalOptions.onCancel();
    setModalOptions(initialModalOptions);
    setShow(false);
  }, [modalOptions]);

  return (
    <ConfirmContext.Provider value={showModal}>
      {children}
      <ConfirmModal {...modalOptions} show={show} onCancel={onCancel} onClosed={onClosed} />
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
