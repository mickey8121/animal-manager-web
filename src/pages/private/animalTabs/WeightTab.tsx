import { FC, Fragment, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-hot-toast';

import { TableState } from 'react-table';

import Button from 'components/common/buttons/Button';
import EmptyMessage from 'components/common/EmptyMessage';
import PaginationControls from 'components/common/PaginationControls';
import Table from 'components/common/Table';
import WeightsModal from 'components/animals/weight/WeightsModal';
import ActionsCell from 'components/common/Table/ActionsCell';
import WeightChangePin from 'components/common/animals/WeightChangePin';

import useDeleteWeight from 'hooks/animals/weight/useDeleteWeight';
import useWeights from 'hooks/animals/weight/useWeights';
import useFormat from 'hooks/useFormat';
import useConfirm from 'hooks/useConfirm';

import { ROWS_PER_PAGE_OPTIONS } from 'helpers/constants';

import { OrderDirection, WeightOrderField } from 'generated/graphql';

const WeightTab: FC = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormat();
  const { deleteWeight } = useDeleteWeight();

  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [take, setTake] = useState(ROWS_PER_PAGE_OPTIONS[0].value);

  const deleteConfirm = useConfirm({
    title: t('animals.weight.deleteWeight'),
    description: `${t('common.deleteRecordConfirm', {
      context: t('common.entry').toLowerCase(),
    })}. ${t('common.deleteConfirm')}`,
  });

  const [orderBy, setOrderBy] = useState([
    {
      field: WeightOrderField.Date,
      direction: OrderDirection.Desc,
    },
  ]);

  const {
    weights,
    loading: weightsLoading,
    totalCount,
  } = useWeights({
    take: parseInt(take, 10),
    skip: !take ? 0 : parseInt(take, 10) * currentPage,
    orderBy,
  });

  const loading = useMemo(() => !weights && weightsLoading, [weightsLoading, weights]);
  const isEmpty = useMemo(() => !weights?.length && !loading, [weights, loading]);
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

  const toggleShowModal = useCallback(() => setShowModal(!showModal), [showModal]);

  const handleDelete = useCallback(
    async id => {
      const isConfirmed = await deleteConfirm();

      if (isConfirmed) {
        void toast.promise(deleteWeight(id), {
          loading: t('common.deleting'),
          success: t('common.successDelete', { item: t('animals.weight.weight') }),
          error: t('common.errorDelete'),
        });
      }
    },
    [deleteConfirm, deleteWeight, t],
  );

  const columns = useMemo(
    () => [
      {
        accessor: 'date',
        Header: t('common.date'),
        Cell: ({ value = '' }) => formatDate(value, 'd MMM, yyyy'),
      },
      { accessor: 'weight', Header: t('animals.weight.weight') },
      {
        accessor: 'change',
        Header: t('common.change'),
        disableSortBy: true,
        Cell: ({ value: change = '' }) => <WeightChangePin change={change} />,
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

  const onSort = useCallback(sortState => {
    setOrderBy(
      sortState.map(({ id, desc }: any) => ({ field: id, direction: desc ? 'desc' : 'asc' })),
    );
  }, []);

  const onChangeCurrentPage = useCallback(pageNumber => setCurrentPage(pageNumber - 1), []);
  const onChangeRowsPerPage = useCallback(({ target: { value } }) => value && setTake(value), []);

  return (
    <Fragment>
      <div className='tab-content-header'>
        <h2 className='tab-content-heading'>{t('common.history')}</h2>

        <Button color='primary' onClick={toggleShowModal} className='create-btn'>
          <span className='create-btn-text'>{t('animals.weight.addWeight')}</span>
        </Button>
      </div>

      <div className='tab-content-body'>
        {isEmpty ? (
          <EmptyMessage message={t('common.noEntriesMessage')} hint={t('common.noEntriesHint')} />
        ) : (
          <Table
            columns={columns}
            data={weights ?? []}
            initialState={initialTableState}
            onSort={onSort}
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

      <WeightsModal show={showModal} toggle={toggleShowModal} />
    </Fragment>
  );
};

export default WeightTab;
