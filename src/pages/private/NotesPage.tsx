import { FC, Fragment } from 'react';

import { useTranslation } from 'react-i18next';

import NoteForm from 'components/notes/NoteForm';
import NotesList from 'components/notes/NotesList';
import HelmetWithTemplate from 'components/common/HelmetWithTemplate';

import withErrorBoundary from 'components/common/sentry/withErrorBoundary';

const NotesPage: FC = () => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <HelmetWithTemplate title={t('notes.myNotes')} />
      <div className='page notes-page'>
        <div className='header'>
          <h1 className='heading'>{t('notes.myNotes')}</h1>
        </div>
        <div className='page-body'>
          <div className='page-body-note'>
            <NoteForm />
          </div>
          <NotesList />
        </div>
      </div>
    </Fragment>
  );
};

export default withErrorBoundary(NotesPage);
