import { FC, useEffect, useMemo } from 'react';

import RCPagination, { PaginationProps as RCPaginationProps } from 'rc-pagination';

import LineSkeleton from 'components/common/skeletons/LineSkeleton';
import classNames from 'classnames';

export interface PaginationProps extends RCPaginationProps {
  loading?: boolean;
}

const Pagination: FC<PaginationProps> = ({
  loading = false,
  current = 1,
  total = 0,
  onChange,
  pageSize = 1,
  ...props
}) => {
  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);

  useEffect(() => {
    if (current > totalPages) onChange?.(1, pageSize);
  }, [current, totalPages, pageSize, onChange]);

  return (
    <div className={classNames('pagination', { loading })}>
      {loading ? (
        <LineSkeleton />
      ) : (
        <RCPagination
          showLessItems
          current={current}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          showTitle={false}
          {...props}
        />
      )}
    </div>
  );
};

export default Pagination;
