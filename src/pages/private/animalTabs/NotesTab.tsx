import { FC } from 'react';

import AnimalNotesForm from 'components/animals/form/AnimalNotesForm';

const NotesTab: FC = () => (
  <div className='tab-content-body'>
    <AnimalNotesForm />
  </div>
);

export default NotesTab;
