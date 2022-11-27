import { FC } from 'react';

import ContentLoader from 'react-content-loader';

interface NoteFormProps {
  isGray?: boolean;
}

const NoteFormSkeleton: FC<NoteFormProps> = ({ isGray }) => (
  <ContentLoader
    className='note-form-skeleton'
    backgroundColor={isGray ? '#F6F6F6' : '#FFFFFF'}
    foregroundColor='#D4D4D4'
    speed={2}
  >
    <rect x='0' y='0' />
  </ContentLoader>
);

export default NoteFormSkeleton;
