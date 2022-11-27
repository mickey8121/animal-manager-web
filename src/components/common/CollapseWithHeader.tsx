import { FC, useState, useCallback } from 'react';

import classnames from 'classnames';

import { NavLink } from 'react-router-dom';
import { Collapse } from 'reactstrap';

import { ReactComponent as ChevronIcon } from 'icons/chevron.svg';

interface CollapseWithHeaderProps {
  to: string;
  text: string;
  icon?: string;
  className?: string;
}

const CollapseWithHeader: FC<CollapseWithHeaderProps> = ({
  to,
  text,
  icon,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = useCallback(
    event => {
      event.preventDefault();
      setIsOpen(!isOpen);
    },
    [isOpen],
  );

  return (
    <div className={classnames('collapse-with-header', { open: isOpen }, className)}>
      <NavLink to={to} exact className='collapse-header'>
        {icon && <img alt='' src={icon} className='collapse-icon' />}
        <span className='collapse-text'>{text}</span>
        <button type='button' className='collapse-chevron-btn' onClick={toggleCollapse}>
          <ChevronIcon className='collapse-chevron' />
        </button>
      </NavLink>
      <Collapse isOpen={isOpen} timeout={400}>
        <div className='collapse-content'>{children}</div>
      </Collapse>
    </div>
  );
};

export default CollapseWithHeader;
