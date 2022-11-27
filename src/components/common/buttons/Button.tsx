import { FC } from 'react';

import { Button as RSButton, ButtonProps as RSButtonProps, Spinner } from 'reactstrap';

interface ButtonProps extends RSButtonProps {
  loading?: boolean;
}

const Button: FC<ButtonProps> = ({ loading, disabled, children, ...props }) => (
  <RSButton {...props} disabled={disabled || loading}>
    {loading ? <Spinner color='black' size='sm' className='spinner' /> : children}
  </RSButton>
);

export default Button;
