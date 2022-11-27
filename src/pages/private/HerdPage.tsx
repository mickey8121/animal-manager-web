import { FC, Fragment, useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useReactiveVar } from '@apollo/client';
import { useParams, RouteComponentProps } from 'react-router-dom';

import { toast } from 'react-hot-toast';
import find from 'lodash/find';
import camelCase from 'lodash/camelCase';

import Button from 'components/common/buttons/Button';
import Header from 'components/common/Header';
import EmptyMessage from 'components/common/EmptyMessage';
import SwitchToggle from 'components/common/SwitchToggle';
import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import withErrorBoundary from 'components/common/sentry/withErrorBoundary';
import EmptyPage from 'components/common/EmptyPage';
import Table from 'components/common/Table';
import PaginationControls from 'components/common/PaginationControls';
import ActionsCell from 'components/common/Table/ActionsCell';

import HerdEditButton from 'components/herds/HerdEditButton';
import AnimalNameCell from 'components/animals/animalsTable/AnimalNameCell';
import AnimalStatusCell from 'components/animals/animalsTable/AnimalStatusCell';
import MemberModal from 'components/herds/members/MemberModal/MemberModal';

import useAnimals from 'hooks/animals/useAnimals';
import useAnimalAge from 'hooks/animals/useAnimalAge';
import useConfirm from 'hooks/useConfirm';
import useDeleteAnimal from 'hooks/animals/animal/useDeleteAnimal';
import useUser from 'hooks/user/useUser';
import { HerdMemberRole, useHerdQuery } from 'generated/graphql';

import app from 'helpers/app';
import { HERDS_ROUTE, ROWS_PER_PAGE_OPTIONS } from 'helpers/constants';
import isNotActiveOnlyCollectionVar from 'helpers/apolloReactiveVars';

interface Params {
  herdId: string;
}

const { appName } = app;

const HerdPage: FC<RouteComponentProps> = ({
  history: {
    push,
    location: { pathname },
  },
}) => {
  const { t } = useTranslation();
  const { herdId } = useParams<Params>();
  const isNotActiveOnly = useReactiveVar(isNotActiveOnlyCollectionVar);
  const user = useUser();

  const [currentPage, setCurrentPage] = useState(0);
  const [modalShow, setModalShow] = useState(false);
  const [take, setTake] = useState(parseInt(ROWS_PER_PAGE_OPTIONS[0].value, 10));
  const {
    animals,
    totalCount,
    loading: loadingAnimals,
  } = useAnimals({
    herdId,
    sortByStatus: true,
    isActiveOnly: !isNotActiveOnly[herdId],
    take,
    skip: take * currentPage,
  });

  const { data: { herd = undefined } = {}, loading: loadingHerd } = useHerdQuery({
    variables: { where: { id: herdId } },
  });

  const goToCreateAnimalPage = useCallback(
    (): void => push(`/${HERDS_ROUTE}/${herdId}/create-animal`),
    [herdId, push],
  );

  const handleToggleChange = useCallback((): void => {
    isNotActiveOnlyCollectionVar({ ...isNotActiveOnly, [herdId]: !isNotActiveOnly[herdId] });
  }, [herdId, isNotActiveOnly]);

  const { deleteAnimal } = useDeleteAnimal();

  const toggleModalShow = useCallback((): void => setModalShow(!modalShow), [modalShow]);

  const deleteConfirm = useConfirm({
    title: t('animals.deleteAnimal', { animal: t(`animals.${app.appName}`), context: app.appName }),
    description: `${t('animals.deleteAnimalConfirm', { animal: t(`animals.${app.appName}`) })}. ${t(
      'common.deleteConfirm',
    )}`,
  });

  const handleDeleteAnimal = useCallback(
    async (id, name): Promise<void> => {
      const isConfirmed = await deleteConfirm();

      if (isConfirmed) {
        void toast.promise(deleteAnimal(id), {
          loading: t('common.deleting'),
          success: t('animals.successAnimalDeleted', { animal: t(`animals.${app.appName}`), name }),
          error: t('common.errorDelete'),
        });
      }
    },
    [deleteConfirm, deleteAnimal, t],
  );

  const isOwner =
    find(herd?.members, { user: { email: user?.email } })?.role === HerdMemberRole.Owner;

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'animalId', disableSortBy: true, style: { width: 70 } },
      {
        Header: t('common.name'),
        accessor: 'name',
        disableSortBy: true,
        Cell: ({
          row: {
            original: { name = undefined, images = undefined },
          },
        }) => <AnimalNameCell name={name} images={images} />,
      },
      {
        Header: t('animals.status'),
        accessor: 'status',
        disableSortBy: true,
        Cell: ({ row: { original: { status = undefined, sex = undefined } = {} } }) => (
          <AnimalStatusCell status={status} sex={sex} />
        ),
      },
      {
        Header: t('animals.sex'),
        accessor: 'sex',
        disableSortBy: true,
        Cell: ({ value = null }) => t(`animals.sexOptions.${camelCase(value ?? 'unknown')}`),
      },
      {
        Header: t('animals.age.age'),
        accessor: '',
        disableSortBy: true,
        Cell: ({ row: { original: { birthday = '', deathDate = undefined } = {} } }) =>
          useAnimalAge(birthday, deathDate),
      },
      {
        Header: '',
        accessor: 'actions',
        disableSortBy: true,
        style: { width: 92 },
        Cell: ({
          row: {
            original: { id = '', name = '' },
          },
        }) => {
          return isOwner && <ActionsCell onDelete={() => handleDeleteAnimal(id, name)} />;
        },
      },
    ],
    [t, isOwner, handleDeleteAnimal],
  );

  const onChangeCurrentPage = useCallback(pageNumber => setCurrentPage(pageNumber - 1), []);
  const onChangeRowsPerPage = useCallback(
    ({ target: { value } }) => value && setTake(parseInt(value, 10)),
    [],
  );

  const loading = useMemo(
    () => (!animals && loadingAnimals) || (!herd && loadingHerd),
    [animals, loadingAnimals, herd, loadingHerd],
  );
  const paginationLoading = useMemo(
    () => totalCount === undefined && loading,
    [totalCount, loading],
  );

  if (!herd && !loadingHerd) {
    return (
      <EmptyPage
        description={`${t('herds.title', { context: app.appName })} ${t('common.notFound', {
          context: 'many',
        }).toLocaleLowerCase()} 😢`}
        title={t('common.notFound')}
      >
        <Button className='create-btn' color='primary' onClick={goToCreateAnimalPage}>
          <span className='create-btn-text'>{t('herds.createAnimal', { context: appName })}</span>
        </Button>
      </EmptyPage>
    );
  }

  return (
    <Fragment>
      <HelmetWithTemplate title={herd?.name || ''} />

      <MemberModal show={modalShow} toggle={toggleModalShow} herd={herd} />
      <div className='page herd-page'>
        <Header text={herd?.name ?? ''} loading={loadingHerd}>
          {isOwner && (
            <Fragment>
              <Button
                className='members-button btn-secondary btn-light'
                color='secondary'
                onClick={toggleModalShow}
              >
                {t('members.members')}
              </Button>
              <HerdEditButton />
            </Fragment>
          )}

          {totalCount !== 0 && (
            <Button className='create-btn' color='primary' onClick={goToCreateAnimalPage}>
              <span className='create-btn-text'>
                {t('herds.createAnimal', { context: appName })}
              </span>
            </Button>
          )}
        </Header>

        {totalCount === 0 ? (
          <div className='page-body'>
            <EmptyMessage
              message={t('herds.emptyMessage', { context: appName })}
              hint={t('herds.emptyMessageHint', { context: appName })}
            >
              <Button className='create-btn empty' color='primary' onClick={goToCreateAnimalPage}>
                <span className='create-btn-text'>
                  {t('herds.createAnimal', { context: appName })}
                </span>
              </Button>
            </EmptyMessage>
          </div>
        ) : (
          <Fragment>
            <div className='bottom-header'>
              <div className='left-content'>
                <div className='page-body-title'>{t(`animals.${appName}`)}</div>
                {animals && <div className='count-hint'>{animals.length}</div>}
              </div>

              <div className='right-content'>
                <div className='page-body-title'>{t('herds.activeOnly')}</div>
                <SwitchToggle onChange={handleToggleChange} checked={!isNotActiveOnly[herdId]} />
              </div>
            </div>

            <div className='page-body'>
              <Table
                className='animals-table'
                loading={loading}
                columns={columns}
                data={animals ?? []}
                rowOnClick={({ id }) => push(`${pathname}/${id}/profile`)}
              />

              <PaginationControls
                className='animals-table-pagination'
                pagination={{
                  total: totalCount,
                  onChange: onChangeCurrentPage,
                  current: currentPage + 1,
                  loading: paginationLoading,
                  pageSize: take,
                }}
                rowsPerPage={{
                  value: `${take}`,
                  options: ROWS_PER_PAGE_OPTIONS,
                  onChange: onChangeRowsPerPage,
                  loading: paginationLoading,
                }}
              />
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default withErrorBoundary(HerdPage);
