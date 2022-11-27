import { FC, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-hot-toast';

import AppleLogin from 'react-apple-login';
import Button from 'components/common/buttons/Button';

import useAuth from 'hooks/user/useAuth';

import app from 'helpers/app';

import { AuthMethod, AuthUserInfoInput } from 'generated/graphql';

import { ReactComponent as Logo } from 'icons/apple.svg';

interface AppleButtonProps {
  onClick: (e?: any) => void;
  disabled?: boolean;
}

interface AppleLoginResponse {
  error?: Record<string, string>;
  authorization?: Record<string, string>;
  user?: AuthUserInfoInput;
}

const AppleButton: FC = () => {
  const { t } = useTranslation();

  const { signIn, loading } = useAuth();

  const handleResponse = useCallback(
    ({ error, authorization, user }: AppleLoginResponse): void | null | string => {
      if (error) {
        if (error?.error === 'popup_closed_by_user') return null;

        return toast.error(error?.details || error?.error || t('common.appleError'));
      }

      signIn({ appleAccessCode: authorization?.code, method: AuthMethod.Apple, user }).catch(
        () => null,
      );
    },
    [signIn, t],
  );

  const renderAppleButton = ({ onClick, disabled }: AppleButtonProps): JSX.Element => (
    <Button
      type='button'
      className='auth-provider apple'
      onClick={onClick}
      disabled={disabled}
      loading={loading}
    >
      <Logo className='auth-provider-logo' />
      <b className='auth-provider-text'>{t('auth.continueApple')}</b>
    </Button>
  );

  if (!app.appleClientId) return null;

  return (
    <AppleLogin
      clientId={app.appleClientId}
      redirectURI={`${window.location.origin}/_oauth/apple`}
      render={renderAppleButton}
      callback={handleResponse}
      responseMode='query'
      scope='name email'
      usePopup
    />
  );
};

export default AppleButton;
