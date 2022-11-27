import { useCallback, useContext } from 'react';

import { ConfirmContext, ConfirmModalOptions } from 'providers/ConfirmProvider';

const useConfirm = (
  options: ConfirmModalOptions,
): ((overriddenOptions?: ConfirmModalOptions) => Promise<boolean>) => {
  const showModal = useContext(ConfirmContext);

  const confirm = useCallback(
    (overriddenOptions?: ConfirmModalOptions): Promise<boolean> => {
      return new Promise(resolve => {
        if (showModal) {
          showModal({
            ...options,
            ...overriddenOptions,
            onConfirm: () => resolve(true),
            onClosed: () => resolve(false),
            onCancel: () => resolve(false),
          });
        }
      });
    },
    [options, showModal],
  );

  return confirm;
};

export default useConfirm;
