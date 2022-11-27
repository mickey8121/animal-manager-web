import { FC, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { usePrevious } from 'react-use';
import { useParams } from 'react-router-dom';

import { toast } from 'react-hot-toast';
import { set } from 'date-fns';

import { Row, Input, Form, FormGroup } from 'reactstrap';
import RSDatePicker from 'reactstrap-date-picker';

import Button from 'components/common/buttons/Button';
import Dropdown from 'components/common/buttons/Dropdown';

import useUpdateNote from 'hooks/notes/useUpdateNote';
import useCreateNote from 'hooks/notes/useCreateNote';
import useDeleteNote from 'hooks/notes/useDeleteNote';
import useConfirm from 'hooks/useConfirm';
import useFormat from 'hooks/useFormat';

import app from 'helpers/app';

import { Animal, NoteFragmentFragment, useAnimalLazyQuery } from 'generated/graphql';

interface Props {
  note?: NoteFragmentFragment;
}

interface DatePickerProps {
  date: Date;
  onChange: (date: string) => void;
}

interface Params {
  animalId?: string;
}

const addTimeToDate = (date: string, currentDate: Date): string =>
  set(new Date(date || ''), {
    hours: currentDate.getHours(),
    minutes: currentDate.getMinutes(),
    seconds: currentDate.getSeconds(),
  }).toISOString();

const getTodayDate = (): Date => new Date();

const NoteForm: FC<Props> = ({ note }) => {
  const { t } = useTranslation();
  const { animalId } = useParams<Params>();
  const { weekStartsOn, localePattern } = useFormat();

  const prevNote = usePrevious(note);

  const { id, createdAt } = note || {};

  const [inputValue, setInputValue] = useState(note?.note || '');
  const initialDateValue = createdAt || getTodayDate().toISOString();
  const [inputDateValue, setInputDateValue] = useState(initialDateValue);
  const resetNoteForm = (): void => {
    setInputValue('');
    setInputDateValue(getTodayDate().toISOString());
  };

  const { updateNote } = useUpdateNote();

  const handleChangeNoteSubmit = useCallback(() => {
    if (!id) return;

    void toast.promise(updateNote({ note: inputValue }, id, inputDateValue), {
      loading: t('common.updating'),
      success: t('common.successUpdate', { item: t('notes.note'), ruEnding: 'а' }),
      error: t('common.errorUpdate'),
    });
  }, [id, inputDateValue, inputValue, t, updateNote]);

  useEffect(() => {
    if (note?.note !== prevNote?.note && prevNote?.note) setInputValue(note?.note || '');

    if (note?.createdAt !== prevNote?.createdAt && prevNote?.createdAt)
      setInputDateValue(note?.createdAt);

    if (initialDateValue !== inputDateValue) handleChangeNoteSubmit();
  }, [
    handleChangeNoteSubmit,
    initialDateValue,
    inputDateValue,
    note?.createdAt,
    note?.note,
    prevNote?.createdAt,
    prevNote?.note,
  ]);

  const { createNote, loading: noteCreateLoading } = useCreateNote();
  const { deleteNote, loading: deleteLoading } = useDeleteNote();
  const [animalLazyQuery, { data: animalData }] = useAnimalLazyQuery({
    variables: {
      where: { id: animalId || '' },
    },
  });

  useEffect(() => {
    if (animalId) void animalLazyQuery();
  }, [animalId, animalLazyQuery]);

  const { animal } = animalData || {};

  const confirm = useConfirm({
    title: t('notes.noteDelete', { context: app.appName }),
    description: `${t('notes.deleteNoteConfirm', { context: app.appName })}. ${t(
      'common.deleteConfirm',
    )}`,
  });

  const handleDeleteNote = useCallback(() => {
    if (!id) return;

    void toast.promise(deleteNote(id, animalId || null), {
      loading: t('common.deleting'),
      success: t('common.successDelete', {
        item: t('notes.note'),
        ruEnding: 'а',
      }),
      error: t('common.errorDelete'),
    });
  }, [animalId, deleteNote, id, t]);

  const handleNewNoteSubmit = useCallback(() => {
    if (!inputValue.trim().length) return toast.error(t('notes.emptyNote'));
    if (!note?.createdAt && !prevNote?.createdAt) setInputDateValue(getTodayDate().toISOString());

    const currentDateTime = addTimeToDate(inputDateValue, getTodayDate());

    void toast.promise(
      createNote(inputValue, currentDateTime, animal as Animal).then(() => resetNoteForm()),
      {
        loading: t('common.adding'),
        success: t('common.successAdd', { item: t('notes.note'), ruEnding: 'а' }),
        error: t('common.errorAdd'),
      },
    );
  }, [animal, createNote, inputDateValue, inputValue, note?.createdAt, prevNote?.createdAt, t]);

  const onBtnClickDelete = useCallback(async () => {
    if (note) {
      const isConfirmed = await confirm();

      if (isConfirmed) handleDeleteNote();
    }
  }, [confirm, handleDeleteNote, note]);

  const handleFormSubmit: React.FormEventHandler<HTMLInputElement | HTMLFormElement> = e => {
    e.preventDefault();

    if (!id) handleNewNoteSubmit();
  };

  const handleDatePickerChange = (date: string): void => {
    if (date) {
      setInputDateValue(addTimeToDate(date, getTodayDate()));
    }
  };

  const cardDropDownItems = [
    {
      loading: deleteLoading,
      onClick: onBtnClickDelete,
      label: t('common.delete'),
    },
  ];

  const handleInputChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void =>
    setInputValue(value);
  const handleInputBlur = (): void => {
    if (inputValue !== note?.note && id) handleChangeNoteSubmit();
  };
  const handleInputKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();

      if (id) handleChangeNoteSubmit();
      else handleNewNoteSubmit();
    }
  };

  const DatePicker: FC<DatePickerProps> = ({ date, onChange }) => (
    <RSDatePicker
      todayButtonLabel={t('common.today')}
      className='notes-tab-date-picker'
      placeholder={t('common.datePick')}
      showClearButton={false}
      showTodayButton
      weekStartsOn={weekStartsOn}
      value={date}
      onChange={onChange}
      dateFormat={localePattern}
    />
  );

  return (
    <Form className='note-form' key={id} onSubmit={handleFormSubmit}>
      <FormGroup>
        <Row>
          <div className='note-form-group'>
            <div className='note-datepicker'>
              <DatePicker date={inputDateValue} onChange={handleDatePickerChange} />
            </div>
            {!animalId ? <div className='note-animal-name'>{note?.animal?.name}</div> : null}
            {note ? (
              <Dropdown
                dropdownItems={cardDropDownItems}
                direction='left'
                className='dropdown-note-actions'
                color='transparent'
                label='⋯'
              />
            ) : null}
          </div>
          <div className='note-input-textarea'>
            <Input
              className='textarea-note'
              wrap='soft'
              rows={!note ? 3 : inputValue.split('\n').length}
              maxLength={500}
              type='textarea'
              autoFocus={!note && !animalId}
              placeholder={t('notes.notePlaceholder')} //
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleInputKeyDown}
            />
          </div>
          {!note ? (
            <Button
              className='submit-button'
              size='lg'
              loading={noteCreateLoading}
              type='submit'
              color='primary'
            >
              {t('notes.addNote')}
            </Button>
          ) : null}
        </Row>
      </FormGroup>
    </Form>
  );
};

export default NoteForm;
