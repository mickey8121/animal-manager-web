import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import camelCase from 'lodash/camelCase';
import capitalize from 'lodash/capitalize';
import snakeCase from 'lodash/snakeCase';

import Avatar from 'react-avatar';
import { TableState } from 'react-table';
import { Input, Label } from 'reactstrap';

import { RouteComponentProps } from 'react-router-dom';

import HelmetWithTemplate from 'components/common/HelmetWithTemplate';
import EmptyMessage from 'components/common/EmptyMessage';
import Table from 'components/common/Table';
import ColorationPin from 'components/common/animals/ColorationPin';
import PaginationControls from 'components/common/PaginationControls';

import useAnimalsForSale from 'hooks/animals/sale/useAnimalsForSale';
import useAnimalAge from 'hooks/animals/useAnimalAge';
import useFormat from 'hooks/useFormat';

import { COUNTRIES, ROWS_PER_PAGE_OPTIONS } from 'helpers/constants';
import app from 'helpers/app';

import {
  OrderDirection,
  DraftInfoOrderField,
  AnimalInfoOrderField,
  OrderByAnimalForSaleInput,
} from 'generated/graphql';

type OrderingProps = { id: any; desc: boolean };

const { appName } = app;

const getFullCountry = (code: string): string =>
  COUNTRIES.find(country => country.value === code)?.label || code;

const initialTableState = {
  sortBy: [{ id: 'createdAt', desc: true }],
} as Partial<TableState<any>>;

const sexOptions = ['female', 'wether', 'male', 'nonBreedingFemale'];

const AlpacasForSale: FC<RouteComponentProps> = ({
  history: {
    push,
    location: { pathname },
  },
}) => {
  const { t } = useTranslation();
  const { formatDate } = useFormat();

  const [currentPage, setCurrentPage] = useState(0);
  const [take, setTake] = useState(parseInt(ROWS_PER_PAGE_OPTIONS[0].value, 10));
  const [skip, setSkip] = useState(0);
  const [sex, setSex] = useState([]);
  const [phenotype, setPhenotype] = useState([]);

  const variables = useMemo(
    () => ({
      where: {
        sex: sex.length ? sex : undefined,
        phenotype: phenotype.length ? phenotype : undefined,
      },
    }),
    [phenotype, sex],
  );

  const [orderBy, setOrderBy] = useState({
    animal: [
      {
        field: AnimalInfoOrderField.Id,
        direction: OrderDirection.Desc,
      },
    ],
    draft: [
      {
        field: DraftInfoOrderField.CreatedAt,
        direction: OrderDirection.Desc,
      },
    ],
  });

  const { animalsForSale, loading, totalCount } = useAnimalsForSale({
    orderBy,
    take: parseInt(`${take}`, 10),
    skip,
    ...variables,
  });

  useEffect(() => setSkip(take * currentPage), [currentPage, take]);

  // When filters change - reset skip
  useEffect(() => setSkip(0), [phenotype, sex]);

  const onChangeCurrentPage = useCallback(pageNumber => setCurrentPage(pageNumber - 1), []);
  const onChangeRowsPerPage = useCallback(({ target: { value } }) => value && setTake(value), []);

  const columns = useMemo(
    () => [
      {
        accessor: 'createdAt',
        Header: t('common.date'),
        Cell: ({
          row: {
            original: { details },
          },
        }: any) => formatDate(details?.createdAt, 'd MMM, yyyy'),
      },
      {
        accessor: 'name',
        Header: t('common.name'),
        Cell: ({ row: { original: { name = '', images = [{ url: undefined }] } = {} } }) => (
          <Fragment>
            <Avatar
              className='avatar'
              round='8px'
              size='52'
              src={images?.[images.length - 1]?.url}
              name={name}
            />
            <span className='animal-name'>{name}</span>
          </Fragment>
        ),
      },
      {
        accessor: 'owner',
        Header: t('profile.country'),
        Cell: ({ value: owner = { country: '' } }) =>
          t(`countries.${camelCase(getFullCountry(owner?.country))}`),
        disableSortBy: true,
      },
      {
        accessor: 'coloration',
        Header: t('animals.coloration'),
        Cell: ({ value: coloration = [] }) => <ColorationPin coloration={coloration} />,
        style: { maxWidth: 120 },
        disableSortBy: true,
      },
      {
        accessor: 'sex',
        Header: t('animals.sex'),
        Cell: ({ value = null }) => t(`animals.sexOptions.${camelCase(value ?? 'unknown')}`),
      },
      {
        accessor: 'profile.phenotype',
        Header: t('animals.type'),
        disableSortBy: true,
        Cell: ({ value = 'unknown' }) => capitalize(value),
      },
      {
        accessor: '',
        Header: t('animals.age.age'),
        disableSortBy: true,
        Cell: ({ row: { original: { birthday = '' } = {} } }) => useAnimalAge(birthday),
      },
    ],
    [formatDate, t],
  );

  const onSort = useCallback(sortState => {
    const ordering = sortState.reduce(
      (acc: OrderByAnimalForSaleInput, { id: field, desc }: OrderingProps) => {
        const direction = desc ? OrderDirection.Desc : OrderDirection.Asc;

        // Sorting by multiple fields - Sex and Name
        if (field === 'createdAt') {
          acc.draft = [
            {
              field,
              direction,
            },
          ];
        } else {
          acc.animal = [
            ...(acc.animal || []),
            {
              field,
              direction,
            },
          ];
        }

        return acc;
      },
      {},
    );

    setOrderBy(ordering);
  }, []);

  const changeSexHandler = useCallback(
    ({ target: { value = '' } }): void => {
      if (sex.find(v => v === value)) setSex(sex.filter(v => v !== value));
      else setSex(prev => [...prev, value] as never[]);
    },
    [sex],
  );

  const changePhenotypeHandler = useCallback(
    ({ target: { value = '' } }): void => {
      if (phenotype.find(v => v === value)) setPhenotype(phenotype.filter(v => v !== value));
      else setPhenotype(prev => [...prev, value] as never[]);
    },
    [phenotype],
  );

  return (
    <Fragment>
      <HelmetWithTemplate title='Alpacas for sale' />
      <div className='page sale-page'>
        <div className='header'>
          <h1 className='heading'>{t('herds.animalsForSale', { context: appName })}</h1>
        </div>
        <div className='bottom-header'>
          <div className='content'>
            {sexOptions.map(option => (
              <Label key={option} className='label'>
                <Input
                  id={option}
                  value={snakeCase(option).toUpperCase()}
                  type='checkbox'
                  onChange={changeSexHandler}
                  addon
                />
                {t(`animals.sexOptions.${option}`)}
              </Label>
            ))}
            <div className='separator' />
            <Label className='label'>
              <Input
                id='Suri'
                value='SURI'
                type='checkbox'
                onChange={changePhenotypeHandler}
                addon
              />
              Suri
            </Label>
            <Label className='label'>
              <Input
                id='Huacaya'
                value='HUACAYA'
                type='checkbox'
                onChange={changePhenotypeHandler}
                addon
              />
              Huacaya
            </Label>
          </div>
        </div>
        <div className='page-body'>
          {!animalsForSale?.length && !loading ? (
            <EmptyMessage message={t('common.noEntriesMessage')} />
          ) : (
            <Fragment>
              <Table
                columns={columns}
                data={animalsForSale ?? []}
                initialState={initialTableState}
                onSort={onSort}
                loading={loading && !animalsForSale}
                rowOnClick={({ id }) => push(`${pathname}/${id}`)}
              />
              <PaginationControls
                pagination={{
                  total: totalCount,
                  onChange: onChangeCurrentPage,
                  current: currentPage + 1,
                  loading: totalCount === undefined && loading,
                  pageSize: take,
                }}
                rowsPerPage={{
                  value: `${take}`,
                  options: ROWS_PER_PAGE_OPTIONS,
                  onChange: onChangeRowsPerPage,
                  loading: totalCount === undefined && loading,
                }}
              />
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default AlpacasForSale;
