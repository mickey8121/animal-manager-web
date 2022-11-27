import { FC, Fragment } from 'react';

import Header from 'components/common/Header';
import ButtonGoBack from 'components/common/buttons/ButtonGoBack';
import HelmetWithTemplate from 'components/common/HelmetWithTemplate';

interface Props {
  title?: string;
  description?: string;
}

const EmptyPage: FC<Props> = ({ title, description, children }) => (
  <Fragment>
    <HelmetWithTemplate title={title ?? ''} />

    <div className='page'>
      <Header text={title ?? ''}>
        <ButtonGoBack color='light' className='btn-secondary' />
      </Header>
      <div className='page-body empty-page'>
        <b className='empty-page-title'>{title}</b>
        <p className='empty-page-text'>{description}</p>
        {children}
      </div>
    </div>
  </Fragment>
);

export default EmptyPage;
