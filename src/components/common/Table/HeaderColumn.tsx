import { FC, useMemo } from 'react';

import classNames from 'classnames';

import { HeaderGroup, UseSortByColumnProps } from 'react-table';

import { ReactComponent as VectorBottomIcon } from 'icons/vector-bottom.svg';

export type HeaderColumnProps = HeaderGroup<{ [key: string]: any }> &
  UseSortByColumnProps<{ [key: string]: any }> & { style?: { [key: string]: any } };

const HeaderColumn: FC<HeaderColumnProps> = ({
  getHeaderProps,
  render,
  getSortByToggleProps,
  canSort,
  isSorted,
  isSortedDesc,
  Header,
  style = {},
}) => {
  const sortDirectionIcon = useMemo(() => {
    if (!canSort) return null;

    const sortDirection = isSorted && (isSortedDesc ? 'desc' : 'asc');

    const classnamesAsc = classNames('sort-direction-asc', { active: sortDirection === 'asc' });
    const classnamesDesc = classNames('sort-direction-desc', { active: sortDirection === 'desc' });

    return (
      <div className='sort-direction-icon'>
        <VectorBottomIcon className={classnamesAsc} />
        <VectorBottomIcon className={classnamesDesc} />
      </div>
    );
  }, [canSort, isSorted, isSortedDesc]);

  const headerProps = useMemo(
    () => getHeaderProps(getSortByToggleProps()),
    [getHeaderProps, getSortByToggleProps],
  );

  return (
    <th
      {...headerProps}
      style={{ ...headerProps.style, ...style }}
      title={typeof Header === 'string' ? Header : ''}
    >
      <div className='header-cell-wrap'>
        {render('Header')}
        {sortDirectionIcon}
      </div>
    </th>
  );
};

export default HeaderColumn;
