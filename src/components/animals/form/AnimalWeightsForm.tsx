import { FC, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider, Form } from 'formik';

import { toast } from 'react-hot-toast';

import Button from 'components/common/buttons/Button';
import Input from 'components/common/form/Input';
import DatePicker from 'components/common/form/DatePicker';

import useCreateWeight from 'hooks/animals/weight/useCreateWeight';

import { weightsValidationSchema } from 'components/animals/form/validation';

type OnSubmit = (values: { date?: string; weight: string }) => void;

interface Props {
  onCloseModal?: () => void;
}

const AnimalWeightsForm: FC<Props> = ({ onCloseModal }) => {
  const { t } = useTranslation();

  const { createWeight, loading } = useCreateWeight();

  const onSubmit: OnSubmit = useCallback(
    ({ date, weight }) => {
      try {
        void toast.promise(
          createWeight({ date: date || undefined, weight: parseInt(weight, 10) }),
          {
            loading: t('common.adding'),
            success: t('common.successAdd', { item: t('animals.weight.weight') }),
            error: t('common.errorAdd'),
          },
        );

        if (onCloseModal) onCloseModal();
      } catch (err) {}
    },

    [createWeight, onCloseModal, t],
  );

  const formik = useFormik({
    initialValues: { date: '', weight: '' },
    onSubmit,
    validationSchema: weightsValidationSchema,
    validateOnMount: false,
    validateOnBlur: false,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Input
          type='number'
          id='weight'
          name='weight'
          label={t('animals.weight.weight')}
          placeholder={t('animals.weight.weight')}
          maxLength={50}
          autoFocus
        />

        <DatePicker name='date' label={t('common.date')} />

        <Button loading={loading} type='submit' color='primary'>
          {t('common.add')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default AnimalWeightsForm;
