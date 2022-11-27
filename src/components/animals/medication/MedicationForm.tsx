import { FC, useCallback, useMemo, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider, Form, FormikHelpers } from 'formik';
import { useParams } from 'react-router-dom';

import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import isEqual from 'lodash/isEqual';
import { toast } from 'react-hot-toast';
import { addMonths } from 'date-fns/esm';

import DatePicker from 'components/common/form/DatePicker';
import Input from 'components/common/form/Input';
import Button from 'components/common/buttons/Button';
import CreatableSelectField from 'components/common/form/CreatableSelectField';
import SelectField from 'components/common/form/SelectField';

import useRemindOptions, { dateOptions } from 'hooks/animals/medication/useRemindOptions';
import useUpdateMedication from 'hooks/animals/medication/useUpdateMedication';
import useCreateMedication from 'hooks/animals/medication/useCreateMedication';
import useCreateMedicationType from 'hooks/animals/medication/useCreateMedicationType';
import useDeleteMedicationRemind from 'hooks/animals/medication/useDeleteMedicationRemind';
import useDataFromProvider from 'hooks/useDataFromProvider';

import { Option } from 'components/common/select/Select';
import validationSchema from 'components/animals/medication/validation';

import {
  Maybe,
  CreateMedicationInput as CreateMedicationInputRaw,
  MedicationFragmentFragment,
  WhereMedicationTypesInput,
  Scalars,
  useMedicationTypesQuery,
} from 'generated/graphql';

interface CreateMedicationInput extends CreateMedicationInputRaw {
  remind: string;
  nextQuantity: number;
  remindDate: string;
}

type OnSubmit = (
  values: CreateMedicationInput,
  formikHelpers: FormikHelpers<CreateMedicationInput>,
) => Promise<any>;

interface Props {
  medication?: Maybe<MedicationFragmentFragment>;
  onCloseModal?: () => void;
}

export interface Params extends WhereMedicationTypesInput {
  animalId: Scalars['ID'];
}

const valueKeys = ['date', 'typeId', 'dose', 'remind', 'notes', 'nextQuantity', 'remindDate'];

const MedicationForm: FC<Props> = ({ medication, onCloseModal }) => {
  const { t } = useTranslation();
  const { herdId } = useParams<Params>();
  const { refetchReminders } = useDataFromProvider();
  const [medicationTypeOptions, setMedicationTypeOptions] = useState<Option[]>([]);

  const [remindValue, setRemindValue] = useState('');
  const [dateNow, setDateNow] = useState(
    medication?.reminders[0] ? new Date(medication.reminders[0]?.createdAt) : new Date(),
  );

  const {
    data: types,
    loading: typesLoading,
    refetch,
  } = useMedicationTypesQuery({
    variables: { where: { herdId } },
  });
  const { createMedication, loading: createMedicationLoading } = useCreateMedication();
  const { createMedicationType, loading: createMedicationTypeLoading } = useCreateMedicationType();
  const { updateMedication, loading: updateMedicationLoading } = useUpdateMedication();
  const { deleteMedicationReminder } = useDeleteMedicationRemind();

  const { remindOptions, currentRemind } = useRemindOptions(medication);

  const dateValues = useMemo(
    () =>
      dateOptions.map(value =>
        addMonths(new Date(dateNow), parseInt(value, 10)).toISOString()?.slice(0, 10),
      ),
    [dateNow],
  );

  const loading = useMemo(
    () =>
      createMedicationLoading ||
      updateMedicationLoading ||
      typesLoading ||
      createMedicationTypeLoading,
    [createMedicationLoading, createMedicationTypeLoading, typesLoading, updateMedicationLoading],
  );

  const isEdit = useMemo(() => !!medication, [medication]);

  const initialValues = useMemo(() => {
    if (medication) {
      return mapValues(
        pick(
          {
            ...medication,
            typeId: medication.type.id,
            remind: currentRemind ?? 'none',
            nextQuantity: medication.reminders[0]?.dose,
            remindDate: `${medication.reminders[0]?.date}`.slice(0, 10),
          },
          valueKeys,
        ),
        v => v ?? '',
      );
    }

    return valueKeys.reduce((acc, key) => ({ [key]: '', ...acc }), {
      remind: 'none',
      remindDate: '',
    });
  }, [currentRemind, medication]);

  const onSubmit: OnSubmit = useCallback(
    async ({ typeId, remind, nextQuantity, remindDate: remindDateRaw, ...data }) => {
      const type = { typeId, name: '' };

      const isTypeDefined = types?.medicationTypes.some(item => item.id === typeId);
      const remindDate = remind === 'none' ? null : new Date(remindDateRaw);
      const reminder = remindDate ? { date: remindDate, dose: nextQuantity } : undefined;

      const isMedicationChanged = !isEqual(
        {
          ...pick(medication, ['date', 'dose', 'notes']),
          type: medication?.type.id,
          remindDate: medication?.reminders[0]?.date,
          nextQuantity: medication?.reminders[0]?.dose,
        },
        {
          ...pick(data, ['date', 'dose', 'notes']),
          type: typeId,
          remindDate: remindDate ? remindDate.toISOString() : null,
          nextQuantity,
        },
      );

      if (!isTypeDefined) {
        try {
          const { data: result } = await createMedicationType(type.typeId);

          type.typeId = result?.createMedicationType.id || '';
          type.name = result?.createMedicationType.name || '';

          setMedicationTypeOptions([
            ...medicationTypeOptions,
            { value: type.name, label: type.name },
          ]);
        } catch (err) {}
      }

      if (isEdit) {
        if (remind === 'none' && medication?.reminders[0]) {
          void deleteMedicationReminder(medication.reminders[0].id);
        }

        if (!isMedicationChanged) {
          return toast.success(
            t('common.successUpdate', {
              item: t('animals.medication.medication'),
            }),
          );
        }

        return void toast
          .promise(
            updateMedication({
              id: medication?.id as string,
              name: type.name,
              values: { typeId: type.typeId, reminder, ...data },
            }),
            {
              loading: t('common.updating'),
              success: t('common.successUpdate', {
                item: t('animals.medication.medication'),
              }),
              error: t('common.errorUpdate'),
            },
          )
          .then(() => {
            void refetchReminders();
            void refetch();
          });
      }

      await toast.promise(
        createMedication({
          typeId: type.typeId,
          reminder,
          ...data,
        }),
        {
          loading: t('common.adding'),
          success: t('common.successAdd', {
            item: t('animals.medication.medication'),
          }),
          error: t('common.errorAdd'),
        },
      );

      void refetchReminders();
      void refetch();
    },
    [
      types?.medicationTypes,
      medication,
      isEdit,
      createMedication,
      t,
      refetchReminders,
      refetch,
      createMedicationType,
      medicationTypeOptions,
      updateMedication,
      deleteMedicationReminder,
    ],
  );

  const formik = useFormik({
    initialValues: initialValues as CreateMedicationInput,
    validationSchema,
    onSubmit: (...args) => {
      void onSubmit(...args).then(() => onCloseModal && onCloseModal());
    },
    validateOnMount: false,
  });

  const { handleSubmit, values, setFieldValue } = formik;

  const isDateChangedByDateInput = useMemo(
    () => values.remindDate?.length > 11,
    [values.remindDate],
  );

  const isDateChangedByRemindSelect = useMemo(
    () =>
      !values.remindDate || (dateOptions.includes(values.remind) && remindValue === 'customDate'),
    [remindValue, values.remind, values.remindDate],
  );

  const isDateCleared = useMemo(
    () => values.remindDate === null && remindValue !== 'customDate',
    [remindValue, values.remindDate],
  );

  const isRemindDefined = useMemo(() => values.remind !== 'none', [values.remind]);

  useEffect(() => {
    const remind = parseInt(values.remind, 10);

    setRemindValue(values.remind);

    if (remind) {
      const currentDate = addMonths(new Date(dateNow), remind).toISOString()?.slice(0, 10);

      if (isDateCleared) return void setFieldValue('remind', 'customDate');

      if (!isDateChangedByDateInput || isDateChangedByRemindSelect) {
        void setFieldValue('remindDate', currentDate);
      } else {
        void setFieldValue('remind', 'customDate');
      }
    }

    if (values.remind === 'none') void setFieldValue('remindDate', '');
  }, [
    setFieldValue,
    values,
    remindValue,
    dateValues,
    dateNow,
    initialValues,
    isDateChangedByDateInput,
    isDateChangedByRemindSelect,
    isDateCleared,
  ]);

  useEffect(() => {
    if (values.remind !== initialValues.remind) {
      setDateNow(new Date());
    }
  }, [initialValues, values]);

  useEffect(() => {
    if (types?.medicationTypes) {
      setMedicationTypeOptions(
        types.medicationTypes.map(type => ({ label: type.name, value: type.id })),
      );
    }
  }, [types]);

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <DatePicker
          name='date'
          label={t('common.date')}
          calendarPlacement={!isRemindDefined ? 'bottom' : 'left'}
        />
        <CreatableSelectField
          name='typeId'
          options={medicationTypeOptions ?? []}
          label={t('animals.type')}
          placeholder={t('animals.type')}
          loading={typesLoading}
          openMenuOnFocus
        />
        <Input name='dose' type='number' label={t('animals.medication.dose')} />
        <SelectField
          name='remind'
          options={remindOptions}
          label={t('animals.medication.remind')}
          placeholder={t('animals.medication.remind')}
          openMenuOnFocus
          isSearchable={false}
        />
        {!!values.remind && isRemindDefined && (
          <DatePicker name='remindDate' label={t('animals.medication.remindDate')} />
        )}
        {isRemindDefined && values.remindDate && (
          <Input name='nextQuantity' type='number' label={t('animals.medication.nextQuantity')} />
        )}
        <Input
          name='notes'
          className='textarea-note'
          label={t('notes.notes')}
          wrap='soft'
          maxLength={500}
          type='textarea'
          placeholder={t('notes.notePlaceholder')}
        />
        <Button loading={loading} type='submit' color='primary'>
          {t(medication ? 'common.save' : 'common.add')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default MedicationForm;
