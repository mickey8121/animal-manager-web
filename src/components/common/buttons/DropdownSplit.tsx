import { FC, useState, useCallback, MouseEventHandler } from 'react';

import {
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownProps,
  DropdownItemProps,
  DropdownItem,
} from 'reactstrap';

import Button from 'components/common/buttons/Button';

interface DropDownItems extends DropdownItemProps {
  label: string;
  onClick: () => void;
}

interface Props extends DropdownProps {
  label?: string;
  color?: string;
  toggleClassName?: string;
  buttonClassName?: string;
  split?: boolean;
  dropDownItems: DropDownItems[];
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
}

const DropdownSplit: FC<Props> = ({
  label,
  color,
  toggleClassName,
  buttonClassName,
  direction,
  split,
  dropDownItems,
  onButtonClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();

      setIsOpen(!isOpen);
    },
    [isOpen],
  );

  return (
    <ButtonDropdown isOpen={isOpen} toggle={toggle} color={color} direction={direction} {...props}>
      {split && (
        <Button
          id='caret'
          color={color}
          className={`btn ${buttonClassName}`}
          onClick={onButtonClick}
        >
          {label}
        </Button>
      )}
      <DropdownToggle split={split} color={color} className={toggleClassName}>
        {!split && label}
      </DropdownToggle>
      <DropdownMenu>
        {dropDownItems.map(({ label: itemLabel, ...itemProps }) => (
          <DropdownItem {...itemProps} key={itemLabel}>
            {itemLabel}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default DropdownSplit;
