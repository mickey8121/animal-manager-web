import { FC, useCallback } from 'react';

import { ReactComponent as EditIcon } from 'icons/edit.svg';
import { ReactComponent as DeleteIcon } from 'icons/delete.svg';

interface Props {
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionsCell: FC<Props> = ({ onEdit, onDelete }) => {
  const onEditHandle = useCallback(
    e => {
      e.stopPropagation();

      if (onEdit) onEdit();
    },
    [onEdit],
  );

  const onDeleteHandle = useCallback(
    e => {
      e.stopPropagation();

      if (onDelete) onDelete();
    },
    [onDelete],
  );

  return (
    <div className='actions-cell'>
      {onEdit && (
        <button type='button' className='action edit btn' onClick={onEditHandle}>
          <EditIcon />
        </button>
      )}
      {onDelete && (
        <button type='button' className='action delete btn' onClick={onDeleteHandle}>
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default ActionsCell;
