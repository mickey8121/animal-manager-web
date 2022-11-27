import { FC, useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';

import Button from 'components/common/buttons/Button';

import app from 'helpers/app';

import { useGenerateGoogleAuthUrlMutation } from 'generated/graphql';

import { ReactComponent as Logo } from 'icons/google.svg';

const GoogleButton: FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [generateGoogleAuthUrl] = useGenerateGoogleAuthUrlMutation();

  const handleClick = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await generateGoogleAuthUrl();

      if (data) window.location.replace(data.generateGoogleAuthUrl);
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [generateGoogleAuthUrl]);

  if (!app.googleClientId) return null;

  return (
    <Button type='button' className='auth-provider google' loading={loading} onClick={handleClick}>
      <Logo className='auth-provider-logo' />
      <b className='auth-provider-text'>{t('auth.continueGoogle')}</b>
    </Button>
  );
};

export default GoogleButton;
