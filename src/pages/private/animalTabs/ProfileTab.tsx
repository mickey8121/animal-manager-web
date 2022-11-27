import { FC } from 'react';

import AnimalProfileForm from 'components/animals/form/AnimalProfileForm';

const ProfileTab: FC = () => (
  <div className='tab-content-body'>
    <AnimalProfileForm />
  </div>
);

export default ProfileTab;
