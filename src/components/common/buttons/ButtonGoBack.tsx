import { FC, useCallback } from 'react';

import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button, ButtonProps as RSButtonProps } from 'reactstrap';

interface ButtonProps extends RSButtonProps {
  backPath?: string;
  color?: string;
  text?: string;
}

const ButtonGoBack: FC<ButtonProps> = ({ color = 'light', backPath, text, ...props }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClick = useCallback(
    () => (backPath ? history.push(backPath) : history.goBack()),
    [backPath, history],
  );

  return (
    <Button {...props} onClick={onClick} color={color} className='btn-secondary btn-back'>
      {text || t('common.back')}
    </Button>
  );
};

export default ButtonGoBack;
