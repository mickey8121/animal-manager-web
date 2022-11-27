import { FC, useState, useMemo, useEffect, useCallback } from 'react';

import { usePrevious } from 'react-use';

import isEqual from 'lodash/isEqual';

import { FormGroup, Label } from 'reactstrap';
import RSCreatableSelect from 'react-select/creatable';
import { Props as ReactSelectProps } from 'react-select';

import { Option } from 'components/common/select/Select';

import useUpdateWhenResize from 'hooks/useUpdateWhenResize';

import createOptionsArray from 'helpers/createOptionsArray';

const components = {
  DropdownIndicator: null,
};

interface Target {
  target: { value: string; name: string };
}

interface Props extends Omit<ReactSelectProps<Option>, 'onChange' | 'value'> {
  label?: string;
  value: string;
  onChange?: (target: Target) => void;
  options: Option[];
}

const CreatableSelect: FC<Props> = ({
  id,
  label,
  value: currentValue,
  onChange,
  options,
  name,
  className,
  children,
  ...props
}) => {
  const [optionsState, setOptionsState] = useState(options);
  const [inputValueState, setInputValueState] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleOnMenuOpen = useCallback(() => setMenuIsOpen(true), []);
  const toggleOnMenuClose = useCallback(() => setMenuIsOpen(false), []);

  useUpdateWhenResize(menuIsOpen);

  const prev = usePrevious(options);

  const value = useMemo(
    () => optionsState.find(o => o.value === currentValue),
    [currentValue, optionsState],
  );

  const handleChange = useCallback(
    (newValue): void => {
      setInputValueState('');

      if (onChange) onChange({ target: { value: newValue.value, name } });
    },
    [name, onChange],
  );

  const handleInputChange = useCallback((inputValue: string): void => {
    setInputValueState(inputValue);
  }, []);

  const handleCreate = useCallback(
    (inputValue: string): void => {
      if (onChange) onChange({ target: { value: inputValue, name } });

      setOptionsState([...optionsState, ...createOptionsArray([inputValue])]);

      setInputValueState('');
    },
    [name, onChange, optionsState],
  );

  useEffect(() => {
    if (!isEqual(prev, options)) setOptionsState(options);
  }, [options, prev]);

  return (
    <FormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <RSCreatableSelect
        className={`react-custom-select-container ${className}`}
        classNamePrefix='react-custom-select'
        menuPosition='absolute'
        menuPortalTarget={document.body}
        components={components}
        inputValue={inputValueState}
        value={value}
        options={optionsState}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onCreateOption={handleCreate}
        onMenuOpen={toggleOnMenuOpen}
        onMenuClose={toggleOnMenuClose}
        {...props}
      />
      {children}
    </FormGroup>
  );
};

export default CreatableSelect;
