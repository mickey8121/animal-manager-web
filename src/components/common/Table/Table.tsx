import { createElement, FC, useCallback, useEffect, useMemo, useState } from 'react';

import {
  UseSortByState,
  Row as RTRow,
  useTable,
  UseSortByOptions,
  TableOptions,
  useSortBy,
} from 'react-table';

import classNames from 'classnames';

import Dropdown from 'components/common/buttons/Dropdown';
import HeaderGroup from 'components/common/Table/HeaderGroup';
import Row from 'components/common/Table/Row';

import DataProvider from 'providers/DataProvider';

interface Action {
  label: string;
  disabled?: boolean;
  onClick: (item?: any) => void;
}

interface TableProperties extends TableOptions<any>, UseSortByOptions<{ [key: string]: any }> {
  loading?: boolean;
  actions?: Action[];
  rowOnClick?: (item: any) => void;
  onSort?: (item: UseSortByState<any>) => void;
  className?: string;
}

const defaultData = [{}, {}, {}, {}, {}];

const Table: FC<TableProperties> = ({
  className,
  columns: rawColumns,
  data: recentData,
  loading,
  actions,
  rowOnClick,
  onSort,
  manualSortBy = true,
  ...props
}) => {
  const columns = useMemo(() => {
    if (actions?.length) {
      return [
        ...rawColumns,
        {
          style: { width: 80 },
          Header: 'Actions',
          Cell: ({ row: { original: item = null } = {} }) =>
            createElement(Dropdown, {
              direction: 'left',
              color: '',
              dropdownItems: actions.map(({ onClick, ...action }) => ({
                ...action,
                onClick: () => onClick(item),
              })),
            }),
        },
      ];
    }

    return rawColumns;
  }, [rawColumns, actions]);

  // if loading passed using 'defaultData' for skeleton
  const [data, setData] = useState(loading === undefined ? recentData : defaultData);

  // save the prev data to draw the skeleton if 'loading' passed
  useEffect(() => {
    if (!(loading && !recentData?.length)) setData(recentData);
  }, [recentData, loading, data?.length]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state = {},
  } = useTable(
    { columns, data, manualSortBy, disableSortRemove: true, ...props } as TableProperties,
    useSortBy,
  );

  const { sortBy = [] } = state as any;

  useEffect(() => {
    if (onSort) onSort(sortBy);
  }, [sortBy, onSort]);

  const tableProps = useMemo(() => getTableProps(), [getTableProps]);
  const tableBodyProps = useMemo(() => getTableBodyProps(), [getTableBodyProps]);

  const renderRow: (row: RTRow<any>) => React.ReactElement = useCallback(
    row => {
      prepareRow(row);

      return <Row key={row.id} row={row} onClick={rowOnClick} />;
    },
    [prepareRow, rowOnClick],
  );

  return (
    // pass 'loading' to Cell for skeleton draw
    <DataProvider value={{ loading }}>
      <div className={classNames('table-content-wrap', className)}>
        <div className='table-wrap'>
          <table {...tableProps}>
            <thead>
              {headerGroups.map(headerGroup => (
                <HeaderGroup key={headerGroup.getHeaderGroupProps().key} {...headerGroup} />
              ))}
            </thead>
            <tbody {...tableBodyProps}>{rows.map(renderRow)}</tbody>
          </table>
        </div>
      </div>
    </DataProvider>
  );
};

export default Table;
