import { FC, Fragment } from 'react';

import NotesList from 'components/notes/NotesList';
import NoteForm from 'components/notes/NoteForm';

const AnimalNotesForm: FC = () => (
  <Fragment>
    <div className='notes-tab'>
      <NoteForm />
      <NotesList />
    </div>
  </Fragment>
);

export default AnimalNotesForm;
