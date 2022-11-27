import { FC, useCallback, useState } from 'react';

import classnames from 'classnames';

import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownProps,
  DropdownItemProps,
  DropdownItem,
} from 'reactstrap';

import { ReactComponent as Dots } from 'icons/dropdown-dots.svg';

interface Props extends DropdownProps {
  label?: string;
  color?: string;
  toggleClassName?: string;
  buttonClassName?: string;
  dropdownItems: DropdownItemProps[];
}

const Dropdown: FC<Props> = ({ color, direction, toggleClassName, dropdownItems, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();

      setIsOpen(!isOpen);
    },
    [isOpen],
  );

  return (
    <ButtonDropdown
      isOpen={isOpen}
      toggle={toggleOpen}
      color={color}
      direction={direction}
      className='am-dropdown-button'
      {...props}
    >
      <DropdownToggle
        color={color}
        className={classnames('btn am-dropdown-toggle', toggleClassName)}
      >
        <Dots />
      </DropdownToggle>
      <DropdownMenu>
        {dropdownItems.map(({ label, loading, onClick, ...itemProps }) => (
          <DropdownItem {...itemProps} onClick={!loading ? onClick : undefined} key={label}>
            {label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default Dropdown;
