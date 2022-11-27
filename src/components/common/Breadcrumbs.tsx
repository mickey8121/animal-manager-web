import { FC, Fragment } from 'react';

import { Link } from 'react-router-dom';

export interface Path {
  name: string | undefined;
  path: string;
}

interface BreadcrumbsProps {
  paths: Path[];
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ paths }) => (
  <div className='breadcrumbs'>
    {paths.map(({ name, path }, index) => (
      <Fragment key={path}>
        {index !== 0 && <span className='breadcrumbs-separator'>/</span>}
        {index === paths.length - 1 ? (
          <span className='breadcrumb'>{name}</span>
        ) : (
          <Link className='breadcrumb' to={path}>
            {name ?? path}
          </Link>
        )}
      </Fragment>
    ))}
  </div>
);

export default Breadcrumbs;
