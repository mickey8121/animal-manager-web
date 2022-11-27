import { FC } from 'react';

import ContentLoader from 'react-content-loader';

const LineSkeleton: FC = () => (
  <ContentLoader
    speed={2}
    backgroundColor='#F6F6F6'
    foregroundColor='#D4D4D4'
    height='20'
    width='100%'
  >
    <rect x='0' y='0' rx='8' width='100%' height='20' />
  </ContentLoader>
);

export default LineSkeleton;
