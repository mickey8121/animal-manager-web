import { FC, useMemo } from 'react';

import { useField, ErrorMessage } from 'formik';
import {
  FormGroup,
  Input as RSInput,
  InputProps as RSInputProps,
  FormFeedback,
  Label,
} from 'reactstrap';

import InputSkeleton from '../skeletons/form/InputSkeleton';

export interface InputProps extends RSInputProps {
  name: string;
  label?: string;
  loading?: boolean;
  inputClassName?: string;
}

const Input: FC<InputProps> = ({
  label,
  placeholder: customPlaceholder,
  children,
  className,
  loading,
  inputClassName,
  ...props
}) => {
  const [field, { error, touched }] = useField(props.name);

  const placeholder = useMemo(() => customPlaceholder ?? label, [customPlaceholder, label]);

  if (loading) return <InputSkeleton />;

  return (
    <FormGroup className={className ?? ''}>
      {label && (
        <Label htmlFor={props?.id ?? props.name} className='label'>
          {label}
        </Label>
      )}
      <RSInput
        invalid={!!(error && touched)}
        {...field}
        {...props}
        placeholder={placeholder}
        className={inputClassName}
      />
      {children}
      <ErrorMessage name={props.name}>
        {message => <FormFeedback>{message}</FormFeedback>}
      </ErrorMessage>
    </FormGroup>
  );
};

export default Input;
