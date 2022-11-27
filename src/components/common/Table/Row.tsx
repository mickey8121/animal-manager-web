import { FC, useMemo, memo } from 'react';

import classNames from 'classnames';

import { Row as RTRow } from 'react-table';

import Cell from 'components/common/Table/Cell';

import useDataFromProvider from 'hooks/useDataFromProvider';

interface Props {
  row: RTRow<any>;
  onClick?: (item: any) => void;
}

const Row: FC<Props> = ({ row: { getRowProps, cells, original }, onClick }) => {
  const { loading } = useDataFromProvider();

  const clickable = useMemo(() => !loading && !!onClick, [loading, onClick]);

  const className = classNames({
    clickable,
  });

  return (
    <tr {...getRowProps()} className={className} onClick={() => clickable && onClick?.(original)}>
      {cells.map(cell => (
        <Cell key={cell.column.id} {...cell} />
      ))}
    </tr>
  );
};

export default memo(Row);
