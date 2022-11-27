import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useField, useFormikContext, ErrorMessage } from 'formik';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import RSDatePicker from 'reactstrap-date-picker';

import { InputProps } from 'components/common/form/Input';

import useFormat from 'hooks/useFormat';

const DatePicker: FC<InputProps> = ({ label, name, ...props }) => {
  const [field, { error, touched }] = useField(name);
  const { setFieldTouched } = useFormikContext();
  const { localePattern, weekStartsOn } = useFormat();

  const [isFocused, setIsFocused] = useState(false);

  const onChange = useCallback(
    (value: string): void => {
      if (field.onChange)
        field.onChange({
          target: { value, name },
          type: 'change',
        } as ChangeEvent<HTMLInputElement>);
    },
    [field, name],
  );

  const onFocus = useCallback(() => {
    setIsFocused(true);
    setFieldTouched(name, true);
  }, [setFieldTouched, name]);

  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsFocused(false);
  }, []);

  return (
    <FormGroup className='date-picker'>
      {label && <Label htmlFor={props?.id ?? name}>{label}</Label>}
      <RSDatePicker
        showTodayButton
        className='reactstrap-date-picker-input'
        weekStartsOn={weekStartsOn}
        invalid={!!(error && touched && !isFocused)}
        dateFormat={localePattern.toUpperCase()}
        calendarPlacement='top-start'
        {...field}
        {...props}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        autoComplete='off'
      />
      <ErrorMessage name={name}>{message => <FormFeedback>{message}</FormFeedback>}</ErrorMessage>
    </FormGroup>
  );
};

export default DatePicker;
