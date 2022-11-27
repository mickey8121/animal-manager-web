import { FC, Fragment, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-hot-toast';

import { TableState } from 'react-table';

import Table from 'components/common/Table';
import PaginationControls from 'components/common/PaginationControls';
import ActionsCell from 'components/common/Table/ActionsCell';
import EmptyMessage from 'components/common/EmptyMessage';
import Button from 'components/common/buttons/Button';

import MedicationModal from 'components/animals/medication/MedicationModal';

import useFormat from 'hooks/useFormat';
import useConfirm from 'hooks/useConfirm';

import useDeleteMedication from 'hooks/animals/medication/useDeleteMedication';
import useMedications from 'hooks/animals/medication/useMedications';
import useDataFromProvider from 'hooks/useDataFromProvider';

import { ROWS_PER_PAGE_OPTIONS } from 'helpers/constants';

import {
  Maybe,
  OrderDirection,
  MedicationFragmentFragment,
  MedicationOrderField,
} from 'generated/graphql';

const MedicationTab: FC = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormat();
  const { refetchReminders } = useDataFromProvider();

  const [currentPage, setCurrentPage] = useState(0);
  const [take, setTake] = useState(ROWS_PER_PAGE_OPTIONS[0].value);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Maybe<MedicationFragmentFragment>>(null);
  const [orderBy, setOrderBy] = useState([
    {
      field: MedicationOrderField.Date,
      direction: OrderDirection.Desc,
    },
  ]);

  const deleteConfirm = useConfirm({
    title: t('animals.medication.deleteMedication'),
    description: `${t('common.deleteRecordConfirm', {
      context: t('animals.medication.medication').toLowerCase(),
    })}. ${t('common.deleteConfirm')}`,
  });

  const { deleteMedication } = useDeleteMedication();
  const {
    medications,
    loading: medicationLoading,
    totalCount,
  } = useMedications({
    orderBy,
    take: parseInt(take, 10),
    skip: !take ? 0 : parseInt(take, 10) * currentPage,
  });

  const handleDelete = useCallback(
    async id => {
      const isConfirmed = await deleteConfirm();

      if (isConfirmed) {
        void toast
          .promise(deleteMedication(id), {
            loading: t('common.deleting'),
            success: t('common.successDelete', {
              item: t('animals.medication.medication'),
              ruEnding: 'а',
            }),
            error: t('common.errorDelete'),
          })
          .then(() => void refetchReminders());
      }
    },
    [deleteConfirm, deleteMedication, refetchReminders, t],
  );

  const loading = useMemo(
    () => !medications && medicationLoading,
    [medicationLoading, medications],
  );
  const isEmpty = useMemo(() => !medications?.length && !loading, [loading, medications]);
  const initialTableState = useMemo(
    () =>
      ({
        sortBy: orderBy.map(({ field, direction }) => ({
          id: field,
          desc: direction === 'desc',
        })),
      } as Partial<TableState<any>>),
    [orderBy],
  );
  const columns = useMemo(
    () => [
      {
        accessor: 'date',
        Header: t('common.date'),
        Cell: ({ value = '' }) => formatDate(value, 'd MMM, yyyy'),
      },
      {
        accessor: 'medication',
        Header: t('animals.medication.medication'),
        disableSortBy: true,
      },
      {
        accessor: 'remind',
        Header: t('animals.medication.remind'),
        disableSortBy: true,
      },
      {
        accessor: 'nextQuantity',
        Header: t('animals.medication.nextQuantity'),
        disableSortBy: true,
      },
      {
        accessor: 'dose',
        Header: t('animals.medication.dose'),
      },
      {
        accessor: 'notes',
        Header: t('notes.notes'),
        disableSortBy: true,
      },
      {
        Header: '',
        accessor: 'actions',
        disableSortBy: true,
        style: { width: 92 },
        Cell: ({
          row: {
            original: { id = '' },
          },
        }) => <ActionsCell onDelete={() => handleDelete(id)} />,
      },
    ],
    [formatDate, handleDelete, t],
  );

  const toggleShowModal = useCallback(() => {
    if (showModal) setSelectedItem(null);

    setShowModal(!showModal);
  }, [showModal]);

  const onSort = useCallback(sortState => {
    setOrderBy(
      sortState.map(({ id, desc }: any) => ({ field: id, direction: desc ? 'desc' : 'asc' })),
    );
  }, []);

  const onChangeCurrentPage = useCallback(pageNumber => setCurrentPage(pageNumber - 1), []);
  const onChangeRowsPerPage = useCallback(({ target: { value } }) => value && setTake(value), []);

  const rowOnClick = useCallback(
    (item: any) => {
      setSelectedItem(item);
      toggleShowModal();
    },
    [toggleShowModal],
  );

  const tableData = useMemo(
    () =>
      medications?.map(item => ({
        ...item,
        medication: item.type.name,
        remind: formatDate(item.reminders[0]?.date, 'd MMM, yyyy'),
        nextQuantity: item.reminders[0]?.dose,
      })),
    [formatDate, medications],
  );

  return (
    <Fragment>
      <div className='tab-content-header'>
        <h2 className='tab-content-heading'>{t('common.history')}</h2>

        <Button color='primary' onClick={toggleShowModal} className='create-btn'>
          <span className='create-btn-text'>{t('animals.medication.addMedication')}</span>
        </Button>
      </div>

      <div className='tab-content-body'>
        {isEmpty ? (
          <EmptyMessage message={t('common.noEntriesMessage')} hint={t('common.noEntriesHint')} />
        ) : (
          <Table
            columns={columns}
            data={tableData ?? []}
            initialState={initialTableState}
            onSort={onSort}
            rowOnClick={rowOnClick}
            loading={loading}
          />
        )}
      </div>

      {!isEmpty && (
        <div className='tab-content-footer'>
          <PaginationControls
            pagination={{
              total: totalCount,
              onChange: onChangeCurrentPage,
              current: currentPage + 1,
              loading: totalCount === undefined && loading,
              pageSize: parseInt(take, 10),
            }}
            rowsPerPage={{
              value: `${take}`,
              options: ROWS_PER_PAGE_OPTIONS,
              onChange: onChangeRowsPerPage,
              loading: totalCount === undefined && loading,
            }}
          />
        </div>
      )}

      <MedicationModal show={showModal} toggle={toggleShowModal} medication={selectedItem} />
    </Fragment>
  );
};

export default MedicationTab;
