import { FC } from 'react';

import classNames from 'classnames';

import Pagination, { PaginationProps } from 'components/common/PaginationControls/Pagination';
import RowsPerPage, { RowsPerPageProps } from 'components/common/PaginationControls/RowsPerPage';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  pagination?: PaginationProps;
  rowsPerPage?: RowsPerPageProps;
}

const PaginationControls: FC<Props> = ({ pagination, rowsPerPage, className }) => (
  <div className={classNames('pagination-controls', className)}>
    {rowsPerPage && <RowsPerPage {...rowsPerPage} />}
    {pagination && <Pagination {...pagination} />}
  </div>
);

export default PaginationControls;
