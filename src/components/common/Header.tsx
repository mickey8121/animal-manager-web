import { FC } from 'react';

import HeadingSkeleton from 'components/common/skeletons/HeadingSkeleton';
import classNames from 'classnames';

interface Props {
  text: string;
  subText?: string;
  loading?: boolean;
  center?: boolean;
}

const Header: FC<Props> = ({ children, text, subText, loading, center = false }) => (
  <div className={classNames('header', { center })}>
    <div className='header-left-container'>
      {loading ? <HeadingSkeleton /> : <h1 className='heading'>{text}</h1>}
      {subText && (loading ? <HeadingSkeleton /> : <h6 className='sub-heading'>{subText}</h6>)}
    </div>
    {children && <div className='header-right-container'>{children}</div>}
  </div>
);

export default Header;
