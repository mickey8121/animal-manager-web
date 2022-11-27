import { FC, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import ReactSelect, { Props as ReactSelectProps } from 'react-select';
import { FormGroup, Label } from 'reactstrap';

import useUpdateWhenResize from 'hooks/useUpdateWhenResize';

import { Maybe } from 'generated/graphql';

export interface Option {
  label: string;
  value: string;
}

export interface Target {
  target: { value: Maybe<string>; name: string };
}

export interface SelectProps extends Omit<ReactSelectProps<Option>, 'onChange' | 'value'> {
  label?: string;
  value?: Maybe<string>;
  onChange?: (target: Target) => void;
  options: Option[];
}

const Select: FC<SelectProps> = ({
  name,
  id,
  label,
  value: initialValue,
  onChange,
  options,
  children,
  className,
  placeholder: customPlaceholder,
  ...props
}) => {
  const { t } = useTranslation();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const toggleOnMenuOpen = useCallback(() => setMenuIsOpen(true), []);
  const toggleOnMenuClose = useCallback(() => setMenuIsOpen(false), []);

  useUpdateWhenResize(menuIsOpen);

  const handleChange = useCallback(
    (newValue: Maybe<Option>) => {
      if (onChange) onChange({ target: { value: newValue?.value || null, name } });
    },
    [onChange, name],
  );

  const value = useMemo(() => {
    return options.find(o => o.value === initialValue) || null;
  }, [initialValue, options]);

  const placeholder = useMemo(
    () => customPlaceholder ?? `${t('common.select')}${label ? ` ${label.toLowerCase()}` : '...'}`,
    [customPlaceholder, label, t],
  );

  return (
    <FormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <ReactSelect
        id={id}
        value={value}
        placeholder={placeholder}
        menuPortalTarget={document.body}
        menuPosition='absolute'
        className={`react-custom-select-container ${className}`}
        classNamePrefix='react-custom-select'
        onChange={handleChange}
        options={options}
        menuIsOpen={menuIsOpen}
        onMenuOpen={toggleOnMenuOpen}
        onMenuClose={toggleOnMenuClose}
        {...props}
      />
      {children}
    </FormGroup>
  );
};

export default Select;
