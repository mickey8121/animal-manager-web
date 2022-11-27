import { FC, memo } from 'react';

import Avatar from 'react-avatar';

import { Image } from 'generated/graphql';

const AnimalNameCell: FC<{ name?: string; images?: Image[] }> = ({ name, images }) => (
  <div className='animal-name-cell'>
    <Avatar
      className='avatar'
      round='8px'
      size='52'
      src={images?.[images.length - 1]?.thumbUrl}
      name={name}
    />
    <span className='animal-name'>{name}</span>
  </div>
);

export default memo(AnimalNameCell);
