import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import toast from 'react-hot-toast';

type UseLoadingToast = (isLoading: boolean, message?: string) => void;

const useLoadingToast: UseLoadingToast = (isLoading, message) => {
  const { t } = useTranslation();
  const [toastId, setToastId] = useState<string | null>(null);
  const loadingMessage = message || `${t('common.loading')}...`;

  useEffect(() => {
    if (isLoading && !toastId) setToastId(toast.loading(loadingMessage));
    if (!isLoading && toastId) {
      toast.remove(toastId);
      setToastId(null);
    }
  }, [isLoading, loadingMessage, toastId]);
};

export default useLoadingToast;
