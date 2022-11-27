import { FC, Fragment, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import NoteFormSkeleton from 'components/common/skeletons/NoteFormSkeleton';
import PaginationControls from 'components/common/PaginationControls';
import NoteForm from 'components/notes/NoteForm';

import useNotes from 'hooks/notes/useNotes';

const take = 10;
const renderSkeletons: (isGray: boolean) => JSX.Element[] = isGray =>
  [1, 2, 3, 4, 5].map(key => <NoteFormSkeleton key={key} isGray={isGray} />);

const NotesList: FC = () => {
  const { animalId } = useParams<{ animalId?: string }>();

  const [currentPage, setCurrentPage] = useState(0);

  const {
    notes = null,
    loading,
    totalCount,
  } = useNotes({
    take,
    skip: !take ? 0 : take * currentPage,
  });

  const onChangeCurrentPage = useCallback(
    pageNumber => setCurrentPage(pageNumber - 1),
    [setCurrentPage],
  );

  return (
    <Fragment>
      <Fragment>
        {!notes && loading
          ? renderSkeletons(!!animalId)
          : notes?.map(note => <NoteForm key={note.id} note={note} />)}
      </Fragment>
      <div className='tab-content-footer'>
        <PaginationControls
          pagination={{
            total: totalCount,
            onChange: onChangeCurrentPage,
            current: currentPage + 1,
            loading: totalCount === undefined && loading,
            pageSize: take,
          }}
        />
      </div>
    </Fragment>
  );
};

export default NotesList;
