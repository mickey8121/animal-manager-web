import { FC } from 'react';

import ContentLoader from 'react-content-loader';

const HeadingSkeleton: FC = () => (
  <ContentLoader
    className='heading-skeleton'
    speed={2}
    backgroundColor='#F6F6F6'
    foregroundColor='#D4D4D4'
  >
    <rect x='0' y='0' />
  </ContentLoader>
);

export default HeadingSkeleton;
