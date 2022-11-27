import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import HelmetWithTemplate from 'components/common/HelmetWithTemplate';

interface Props {
  page?: boolean;
  fullscreen?: boolean;
  className?: string;
}

const Loading: FC<Props> = ({ page, fullscreen, className }) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <HelmetWithTemplate showTemplate={false} title={t('common.loading')} />

      <div className={classnames('loading', { fullscreen, page }, className)}>
        <div className='loader' />
      </div>
    </Fragment>
  );
};

export default Loading;
