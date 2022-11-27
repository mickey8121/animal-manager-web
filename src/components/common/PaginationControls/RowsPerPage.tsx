import { FC, Fragment } from 'react';

import { useTranslation } from 'react-i18next';

import Select, { SelectProps } from 'components/common/select/Select';
import LineSkeleton from '../skeletons/LineSkeleton';

export type RowsPerPageProps = Pick<SelectProps, 'value' | 'options' | 'onChange'> & {
  loading?: boolean;
};

const RowsPerPage: FC<RowsPerPageProps> = ({ loading, ...props }) => {
  const { t } = useTranslation();

  return (
    <div className='rows-per-page'>
      {loading ? (
        <LineSkeleton />
      ) : (
        <Fragment>
          <div className='rows-per-page-title'>{`${t('common.rowsPerPage')}:`}</div>
          <div className='rows-per-page-select'>
            <Select name='rowsPerPage' isSearchable={false} defaultMenuIsOpen {...props} />
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default RowsPerPage;
