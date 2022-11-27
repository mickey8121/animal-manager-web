import { FC } from 'react';

import { HeaderGroup as RTHeaderGroup } from 'react-table';

import HeaderColumn from 'components/common/Table/HeaderColumn';

const HeaderGroup: FC<RTHeaderGroup<{ [key: string]: any }>> = ({
  getHeaderGroupProps,
  headers,
}) => (
  <tr {...getHeaderGroupProps()}>
    {headers.map(col => (
      <HeaderColumn key={col.id} {...(col as any)} />
    ))}
  </tr>
);

export default HeaderGroup;
