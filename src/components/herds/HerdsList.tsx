import { FC } from 'react';

import HerdCard from 'components/herds/HerdCard';

import { Herd } from 'generated/graphql';

interface HerdsListProps {
  herds?: Herd[];
}

const HerdsList: FC<HerdsListProps> = ({ herds }) => (
  <div className='herds'>
    <div className='herds-list'>
      {herds?.map(herd => (
        <HerdCard key={herd.id} herd={herd} />
      ))}
    </div>
  </div>
);

export default HerdsList;
