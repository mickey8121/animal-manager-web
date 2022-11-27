import { FC, memo } from 'react';

import { Cell as RTCell } from 'react-table';

import LineSkeleton from 'components/common/skeletons/LineSkeleton';

import useDataFromProvider from 'hooks/useDataFromProvider';

const Cell: FC<RTCell<any, any> & { column: { style?: { [key: string]: any } } }> = ({
  getCellProps,
  render,
  column: { style = {} },
}) => {
  const { loading } = useDataFromProvider();

  return (
    <td {...getCellProps()} style={style}>
      <div className='cell-wrap'>{loading ? <LineSkeleton /> : render('Cell')}</div>
    </td>
  );
};

export default memo(Cell);
