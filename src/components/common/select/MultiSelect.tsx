import { FC, useState, useMemo, useCallback } from 'react';

import { FormGroup, Label } from 'reactstrap';
import ReactSelect, { Props as ReactSelectProps, OptionsType } from 'react-select';

import { Option } from 'components/common/select/Select';

import useUpdateWhenResize from 'hooks/useUpdateWhenResize';

const components = {
  DropdownIndicator: null,
};

interface Target {
  target: { value: string[] | string; name: string };
}

interface Props extends Omit<ReactSelectProps<Option>, 'onChange' | 'value'> {
  label?: string;
  value: string[] | string;
  onChange?: (target: Target) => void;
  options: Option[];
}

const MultiSelect: FC<Props> = ({
  id,
  label,
  value: initialValue,
  onChange,
  options,
  name,
  children,
  className,
  ...props
}) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const toggleOnMenuOpen = useCallback(() => setMenuIsOpen(true), []);
  const toggleOnMenuClose = useCallback(() => setMenuIsOpen(false), []);

  useUpdateWhenResize(menuIsOpen);

  const value = useMemo(
    () =>
      (initialValue?.length && options.filter(option => initialValue.includes(option.value))) ||
      null,
    [initialValue, options],
  );

  const handleChange = useCallback(
    (newValue: OptionsType<Option>): void => {
      const newValueArray = newValue.length ? newValue.map((option: Option) => option.value) : '';

      if (onChange) onChange({ target: { value: newValueArray, name } });
    },
    [name, onChange],
  );

  return (
    <FormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <ReactSelect
        className={`react-custom-select-container ${className}`}
        classNamePrefix='react-custom-select'
        menuPosition='absolute'
        menuPortalTarget={document.body}
        components={components}
        value={value}
        options={options}
        onChange={handleChange}
        onMenuOpen={toggleOnMenuOpen}
        onMenuClose={toggleOnMenuClose}
        isMulti
        {...props}
      />
      {children}
    </FormGroup>
  );
};

export default MultiSelect;
