import { FC, Fragment, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-hot-toast';

import { TableState } from 'react-table';

import Table from 'components/common/Table';
import PaginationControls from 'components/common/PaginationControls';
import ActionsCell from 'components/common/Table/ActionsCell';
import ColorationPin from 'components/common/animals/ColorationPin';
import EmptyMessage from 'components/common/EmptyMessage';

import ShearingModal from 'components/animals/shearing/ShearingModal';
import Button from 'components/common/buttons/Button';

import useFormat from 'hooks/useFormat';
import useDeleteShearing from 'hooks/animals/shearing/useDeleteShearing';
import useShearings from 'hooks/animals/shearing/useShearings';
import useConfirm from 'hooks/useConfirm';

import { ROWS_PER_PAGE_OPTIONS } from 'helpers/constants';

import {
  Maybe,
  OrderDirection,
  ShearingFragmentFragment,
  ShearingOrderField,
} from 'generated/graphql';

const ShearingTab: FC = () => {
  const { t } = useTranslation();
  const { formatDate } = useFormat();

  const [currentPage, setCurrentPage] = useState(0);
  const [take, setTake] = useState(ROWS_PER_PAGE_OPTIONS[0].value);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Maybe<ShearingFragmentFragment>>(null);
  const [orderBy, setOrderBy] = useState([
    {
      field: ShearingOrderField.Date,
      direction: OrderDirection.Desc,
    },
  ]);

  const deleteConfirm = useConfirm({
    title: t('animals.shearing.deleteShearing'),
    description: `${t('common.deleteRecordConfirm', {
      context: t('animals.shearing.shearing').toLowerCase(),
    })}. ${t('common.deleteConfirm')}`,
  });

  const { deleteShearing } = useDeleteShearing();
  const {
    shearings,
    loading: shearingLoading,
    totalCount,
  } = useShearings({
    orderBy,
    take: parseInt(take, 10),
    skip: !take ? 0 : parseInt(take, 10) * currentPage,
  });

  const handleDelete = useCallback(
    async id => {
      const isConfirmed = await deleteConfirm();

      if (isConfirmed) {
        void toast.promise(deleteShearing(id), {
          loading: t('common.deleting'),
          success: t('common.successDelete', {
            item: t('animals.shearing.shearing'),
            ruEnding: 'а',
          }),
          error: t('common.errorDelete'),
        });
      }
    },
    [deleteConfirm, deleteShearing, t],
  );

  const loading = useMemo(() => !shearings && shearingLoading, [shearingLoading, shearings]);
  const isEmpty = useMemo(() => !shearings?.length && !loading, [loading, shearings?.length]);
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
        accessor: 'weight',
        Header: t('animals.weight.weight'),
      },
      {
        accessor: 'coloration',
        Header: t('animals.coloration'),
        Cell: ({ value: coloration = [] }) => <ColorationPin coloration={coloration} />,
        style: { maxWidth: 120 },
      },
      {
        accessor: 'shearing',
        Header: t('animals.shearing.shearing'),
      },
      {
        accessor: 'density',
        Header: t('animals.shearing.density'),
      },
      {
        accessor: 'micron',
        Header: t('animals.shearing.micron'),
      },
      {
        accessor: 'deviation',
        Header: t('animals.shearing.deviation'),
        disableSortBy: true,
      },
      {
        accessor: 'variation',
        Header: t('animals.shearing.variation'),
      },
      {
        accessor: 'fibresPercentage',
        Header: t('animals.shearing.fibresPercentage'),
      },
      {
        accessor: 'curvature',
        Header: t('animals.shearing.curvature'),
      },
      {
        accessor: 'comfortFactor',
        Header: t('animals.shearing.comfortFactor'),
      },
      {
        accessor: 'length',
        Header: t('common.length'),
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

  return (
    <Fragment>
      <div className='tab-content-header'>
        <h2 className='tab-content-heading'>{t('common.history')}</h2>

        <Button color='primary' onClick={toggleShowModal} className='create-btn'>
          <span className='create-btn-text'>{t('animals.shearing.addShearing')}</span>
        </Button>
      </div>

      <div className='tab-content-body'>
        {isEmpty ? (
          <EmptyMessage message={t('common.noEntriesMessage')} hint={t('common.noEntriesHint')} />
        ) : (
          <Table
            columns={columns}
            data={shearings ?? []}
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

      <ShearingModal show={showModal} toggle={toggleShowModal} shearing={selectedItem} />
    </Fragment>
  );
};

export default ShearingTab;
