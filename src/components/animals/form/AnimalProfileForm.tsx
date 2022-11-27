import { FC, useCallback, useMemo, useEffect } from 'react';

import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider, Form } from 'formik';

import isEqual from 'lodash/isEqual';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import mapValues from 'lodash/mapValues';
import capitalize from 'lodash/capitalize';
import { toast } from 'react-hot-toast';

import { Row, Col } from 'reactstrap';

import Button from 'components/common/buttons/Button';
import Input from 'components/common/form/Input';
import SelectField from 'components/common/form/SelectField';
import DatePicker from 'components/common/form/DatePicker';
import MultiSelectField from 'components/common/form/MultiSelectField';

import StatusInput from 'components/animals/form/StatusInput';
import { animalProfileValidationSchema } from 'components/animals/form/validation';

import useAnimalOptions from 'hooks/animals/useAnimalOptions';
import useUpdateAnimal, { UpdateAnimalValues } from 'hooks/animals/animal/useUpdateAnimal';
import useCreateAnimal, { CreateAnimalValues } from 'hooks/animals/animal/useCreateAnimal';
import useAnimalFromProvider from 'hooks/animals/animal/useAnimalFromProvider';
import useAnimalColors from 'hooks/animals/useAnimalColors';

import useIsHerdOwner from 'hooks/herds/members/useIsHerdOwner';
import useHerdsOptions from 'hooks/herds/useHerdOptions';

import getObjectDifference from 'helpers/getObjectDifference';
import { HERDS_ROUTE } from 'helpers/constants';
import getNumberFieldValue from 'helpers/getNumberFieldValue';

import app from 'helpers/app';

import {
  AlpacaProfile,
  AnimalStatus,
  CreateAnimalMutation,
  Herd,
  Maybe,
  UpdateAnimalMutation,
} from 'generated/graphql';

type AnimalFormValues = UpdateAnimalValues & CreateAnimalValues;
type CreateAnimal = (data: CreateAnimalValues) => void;
type UpdateAnimal = (data: UpdateAnimalValues) => void;

const convertIntValue = (value?: Maybe<string | number>): Maybe<number> => {
  if (isNumber(value)) return value;
  if (isString(value)) return parseInt(value, 10);

  return null;
};

const AnimalProfileForm: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const { herdId, animalId: animalIdParam } = useParams<{ animalId: string; herdId: string }>();

  const { animal, loading: animalLoading } = useAnimalFromProvider();

  const { herdsOptions } = useHerdsOptions();

  const checkIsOwner = useIsHerdOwner();
  const isOwner = useMemo(() => checkIsOwner(animal?.herd as Herd), [animal?.herd, checkIsOwner]);

  const { updateAnimal, loading: updateAnimalLoading } = useUpdateAnimal();
  const { createAnimal, loading: createAnimalLoading } = useCreateAnimal();

  const loading = useMemo(
    () => updateAnimalLoading || createAnimalLoading,
    [updateAnimalLoading, createAnimalLoading],
  );

  const isEditMode = useMemo(() => !!animal, [animal]);

  const initialValues = useMemo<AnimalFormValues>(() => {
    return {
      name: animal?.name ?? '',
      animalId: getNumberFieldValue(animal?.animalId) as number,
      birthday: animal?.birthday,
      coloration: animal?.coloration ?? [],
      deathDate: animal?.deathDate,
      // temporary
      fatherId: getNumberFieldValue(animal?.fatherId) as number,
      motherId: getNumberFieldValue(animal?.motherId) as number,
      saleDate: animal?.saleDate,
      sex: animal?.sex,
      status: animal?.status ?? AnimalStatus.Active,
      statusNotes: animal?.statusNotes ?? '',
      transferredTo: animal?.transferredTo ?? '',
      herdId: animal?.herd?.id,
      alpacaProfile: { phenotype: (animal?.profile as AlpacaProfile)?.phenotype },
    };
  }, [animal]);

  const onCreateAnimal: CreateAnimal = useCallback(
    ({ animalId, fatherId, motherId, ...rawValues }) => {
      const values = mapValues(rawValues, value => value || null);

      const animalData = {
        ...values,
        animalId: convertIntValue(animalId),
        fatherId: convertIntValue(fatherId),
        motherId: convertIntValue(motherId),
      };

      void createAnimal(animalData, herdId)
        .then(({ data }) => {
          const { createAnimal: { id = null } = {} } = data as CreateAnimalMutation;

          if (id) history.replace(`/${HERDS_ROUTE}/${herdId}/${id}/profile`);
        })
        .catch(() => null);
    },
    [createAnimal, herdId, history],
  );

  const onUpdateAnimal: UpdateAnimal = useCallback(
    data => {
      if (!isEqual(initialValues, data)) {
        const updatedValues = getObjectDifference(initialValues, data);

        void toast.promise(
          updateAnimal(
            {
              ...updatedValues,
            },
            animal?.id || '',
          ),
          {
            loading: t('common.saving'),
            success: result => {
              const resultData = result.data as UpdateAnimalMutation;
              const {
                updateAnimal: {
                  herd: { id },
                },
              } = resultData;

              if (id !== herdId) {
                history.push(`/${HERDS_ROUTE}/${id}/${animalIdParam}/profile`);
              }

              return t('common.successSaving', { item: t('animals.profile') });
            },
            error: t('common.errorSaving'),
          },
        );
      } else {
        toast.success(t('common.successSaving', { item: t('animals.profile') }));
      }
    },
    [animal?.id, animalIdParam, herdId, history, initialValues, t, updateAnimal],
  );

  const onSubmit = useCallback(
    data => (isEditMode ? void onUpdateAnimal(data) : void onCreateAnimal(data)),
    [isEditMode, onUpdateAnimal, onCreateAnimal],
  );

  const formik = useFormik({
    initialValues,
    validationSchema: animalProfileValidationSchema,
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
    enableReinitialize: true,
  });

  const { handleSubmit, values, resetForm } = formik;

  useEffect(() => {
    // If animal is updated, the initialValues will updated too
    // For this case we need reinit Form with updated values
    if (animal) resetForm();
  }, [animal, resetForm]);

  const { animalStatusOptions, animalSexOptions, phenotypeOptions } = useAnimalOptions(values?.sex);
  const colorOptions = useAnimalColors();

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={6}>
            <Input
              autoFocus={!animal}
              id='name'
              name='name'
              label={t('animals.animalName')}
              placeholder={t('animals.animalName')}
              maxLength={50}
            />
          </Col>
          <Col xs={12} md={6}>
            <Input
              id='animalId'
              type='number'
              name='animalId'
              label={t('animals.animalID')}
              placeholder={t('animals.form.animalIDPlaceholder')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <SelectField
              name='sex'
              options={animalSexOptions}
              label={t('animals.sex')}
              initialValue={initialValues.sex}
              isSearchable={false}
              openMenuOnFocus
            />
          </Col>
          <Col xs={12} md={6}>
            <MultiSelectField
              name='coloration'
              options={colorOptions}
              label={t('animals.coloration')}
              initialValues={initialValues.coloration}
              closeMenuOnSelect={false}
              placeholder={t('animals.coloration')}
              openMenuOnFocus
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <Input
              loading={animalLoading}
              id='motherId'
              name='motherId'
              type='number'
              label={t('animals.damId')}
              placeholder={t('animals.damId')}
            />
          </Col>
          <Col xs={12} md={6}>
            <Input
              loading={animalLoading}
              id='fatherId'
              name='fatherId'
              type='number'
              label={t('animals.sireId')}
              placeholder={t('animals.sireId')}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12} md={6}>
            <SelectField
              name='status'
              options={animalStatusOptions}
              label={t('animals.status')}
              isSearchable={false}
              openMenuOnFocus
            />
          </Col>
          <Col xs={12} md={6}>
            <DatePicker name='birthday' label={t('animals.birthday')} />
          </Col>

          {isEditMode && (isOwner || animalLoading) ? (
            <Col xs={12} md={6}>
              <SelectField
                loading={animalLoading}
                name='herdId'
                options={herdsOptions ?? []}
                label={capitalize(t('herds.herd'))}
                isSearchable
              />
            </Col>
          ) : null}

          {app.appName === 'alpaca' && (
            <Col xs={12} md={6}>
              <SelectField
                loading={animalLoading}
                name='alpacaProfile.phenotype'
                options={phenotypeOptions}
                label={t('animals.type')}
              />
            </Col>
          )}

          <Col xs={12} md={6}>
            <StatusInput loading={animalLoading} status={values.status} sex={values.sex} />
          </Col>
        </Row>

        <div className='submit-btn-container'>
          <Button loading={loading} type='submit' color='primary'>
            {isEditMode ? t('common.save') : t('common.create')}
          </Button>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default AnimalProfileForm;
