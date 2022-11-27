import { FC, useState, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import classnames from 'classnames';

import Input from 'components/common/form/Input';
import Button from 'components/common/buttons/Button';

interface Props {
  name: string;
}

const PasswordInput: FC<Props> = ({ name, ...props }) => {
  const [field] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const handleClick = useCallback(() => setShowPassword(!showPassword), [showPassword]);

  return (
    <Input
      label={t(`auth.${name}`)}
      placeholder='************'
      type={showPassword ? 'text' : 'password'}
      className='password'
      inputClassName='password'
      {...props}
      {...field}
    >
      <Button
        type='button'
        className={classnames({ 'show-password': showPassword })}
        onClick={handleClick}
      />
    </Input>
  );
};

export default PasswordInput;
