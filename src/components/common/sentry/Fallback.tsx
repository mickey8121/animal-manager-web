import { FallbackRender } from '@sentry/react/dist/errorboundary';

import i18n from 'startup/i18next';

import { Button } from 'reactstrap';

const Fallback: FallbackRender = () => {
  const handleClick = (): void => {
    window.location.reload();
  };

  return (
    <div className='fallback'>
      <p className='fallback-message'>
        {i18n.t('common.somethingWrong')}
        <span className='fallback-span'>{i18n.t('common.tryReload')}</span>
      </p>
      <Button color='light' className='btn-secondary' onClick={handleClick} />
    </div>
  );
};

export default Fallback;
