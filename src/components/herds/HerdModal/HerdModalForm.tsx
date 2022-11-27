import { FC, useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider, FormikHelpers, Form } from 'formik';

import * as yup from 'yup';
import { toast } from 'react-hot-toast';

import Button from 'components/common/buttons/Button';
import Input from 'components/common/form/Input';

import DeleteHerdButton from 'components/herds/HerdModal/DeleteHerdButton';

import useCreateHerd from 'hooks/herds/useCreateHerd';
import useUpdateHerd from 'hooks/herds/useUpdateHerd';

import app from 'helpers/app';

import { HerdFragmentFragment } from 'generated/graphql';

interface Values {
  name: string;
}

type OnSubmit = (values: Values, formikHelpers: FormikHelpers<Values>) => Promise<any>;

interface Props {
  herd?: HerdFragmentFragment;
  toggle?: () => void;
}

const HerdModalForm: FC<Props> = ({ herd, toggle }) => {
  const { t } = useTranslation();

  const { createHerd, loading: createHerdLoading } = useCreateHerd();
  const { updateHerd, loading: updateHerdLoading } = useUpdateHerd();

  const isEditMode = !!herd;
  const initialValues = useMemo(() => ({ name: herd?.name ?? '' }), [herd?.name]);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().min(2, t('herds.herdNameLength')).required(t('herds.herdNameRequired')),
      }),
    [t],
  );

  const onSubmit: OnSubmit = useCallback(
    ({ name }) => {
      if (isEditMode) {
        toggle?.();

        return toast.promise(updateHerd(name, herd?.id ?? ''), {
          loading: t('common.updating'),
          success: t('common.successUpdate', {
            item: t('herds.herdName'),
          }),
          error: t('common.errorUpdate'),
        });
      }

      return createHerd(name).then(() => toggle?.());
    },
    [createHerd, herd?.id, isEditMode, t, toggle, updateHerd],
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (...args) => {
      void onSubmit(...args).catch(() => null);
    },
    validateOnMount: false,
    validateOnBlur: false,
  });

  const {
    values: { name },
    handleSubmit,
    handleChange,
  } = formik;

  const loading = useMemo(
    () => createHerdLoading || updateHerdLoading,
    [createHerdLoading, updateHerdLoading],
  );

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Input
          autoFocus
          name='name'
          label={t('herds.herdName', { context: app.appName })}
          placeholder={t('herds.herdNamePlaceholder', { context: app.appName })}
          value={name}
          onChange={handleChange}
        />

        {herd ? (
          <div className='button-group'>
            <DeleteHerdButton toggle={toggle} />
            <Button type='submit' className='btn btn-primary' color='primary' loading={loading}>
              {isEditMode ? t('common.save') : t('common.create')}
            </Button>
          </div>
        ) : (
          <Button type='submit' className='btn btn-primary' color='primary' loading={loading}>
            {isEditMode ? t('common.save') : t('common.create')}
          </Button>
        )}
      </Form>
    </FormikProvider>
  );
};

export default HerdModalForm;
