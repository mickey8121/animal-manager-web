import { FC, useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider, Form, FormikHelpers } from 'formik';

import { isNumber, mapValues, pick } from 'lodash';

import { Row, Col } from 'reactstrap';

import DatePicker from 'components/common/form/DatePicker';
import MultiSelectField from 'components/common/form/MultiSelectField';
import Input from 'components/common/form/Input';
import Button from 'components/common/buttons/Button';

import useAnimalColors from 'hooks/animals/useAnimalColors';
import useCreateShearing from 'hooks/animals/shearing/useCreateShearing';
import useUpdateShearing from 'hooks/animals/shearing/useUpdateShearing';

import validationSchema from 'components/animals/shearing/validation';

import { Maybe, CreateShearingInput, ShearingFragmentFragment } from 'generated/graphql';

type Values = Omit<ShearingFragmentFragment, '__typename' | 'id' | 'createdAt' | 'shearingAge'>;
type OnSubmit = (values: Values, formikHelpers: FormikHelpers<Values>) => Promise<any>;

interface Props {
  shearing?: Maybe<ShearingFragmentFragment>;
  onCloseModal?: () => void;
}

const valueKeys = [
  'date',
  'coloration',
  'weight',
  'shearing',
  'density',
  'micron',
  'deviation',
  'variation',
  'fibresPercentage',
  'curvature',
  'comfortFactor',
  'length',
];

const ShearingForm: FC<Props> = ({ shearing, onCloseModal }) => {
  const { t } = useTranslation();
  const colorOptions = useAnimalColors();

  const { createShearing, loading: createShearingLoading } = useCreateShearing();
  const { updateShearing, loading: updateShearingLoading } = useUpdateShearing();

  const loading = useMemo(
    () => createShearingLoading || updateShearingLoading,
    [createShearingLoading, updateShearingLoading],
  );

  const isEdit = useMemo(() => !!shearing, [shearing]);

  const onSubmit: OnSubmit = useCallback(
    ({ date = undefined, coloration = [], ...data }) => {
      const values = mapValues(data, v => (isNumber(v) ? v : null)) as Omit<
        CreateShearingInput,
        'animalId' | 'date' | 'coloration'
      >;

      if (isEdit)
        return updateShearing({
          id: shearing?.id as string,
          values: { date, coloration, ...values },
        });

      return createShearing({ date, coloration, ...values });
    },
    [shearing, isEdit, createShearing, updateShearing],
  );

  const initialValues = useMemo(
    () =>
      shearing
        ? mapValues(pick(shearing, valueKeys), v => v ?? '')
        : valueKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {}),
    [shearing],
  );

  const formik = useFormik({
    initialValues: initialValues as Values,
    validationSchema,
    onSubmit: (...args) => {
      void onSubmit(...args).then(() => onCloseModal && onCloseModal());
    },
    validateOnMount: false,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={12}>
            <MultiSelectField
              name='coloration'
              options={colorOptions}
              label={t('animals.coloration')}
              closeMenuOnSelect={false}
              placeholder={t('animals.coloration')}
              openMenuOnFocus
            />
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={12}>
            <DatePicker name='date' label={t('common.date')} />
          </Col>
          <Col md={4} xs={12}>
            <Input name='weight' type='number' label={t('animals.weight.weight')} />
          </Col>
          <Col md={4} xs={12}>
            <Input name='shearing' type='number' label={t('animals.shearing.shearing')} />
          </Col>
          <Col md={4} xs={12}>
            <Input name='density' type='number' label={t('animals.shearing.density')} />
          </Col>
          <Col md={4} xs={12}>
            <Input name='micron' type='number' label={t('animals.shearing.micron')} />
          </Col>
        </Row>

        <Row>
          <Col md={4} xs={12}>
            <Input name='deviation' type='number' label={t('animals.shearing.deviation')} />
          </Col>
          <Col md={4} xs={12}>
            <Input name='variation' type='number' label={t('animals.shearing.variation')} />
          </Col>
          <Col md={4} xs={12}>
            <Input
              name='fibresPercentage'
              type='number'
              label={t('animals.shearing.fibresPercentage')}
            />
          </Col>
          <Col md={4} xs={12}>
            <Input name='curvature' type='number' label={t('animals.shearing.curvature')} />
          </Col>
          <Col md={4} xs={12}>
            <Input name='comfortFactor' type='number' label={t('animals.shearing.comfortFactor')} />
          </Col>
          <Col md={4} xs={12}>
            <Input name='length' type='number' label={t('common.length')} />
          </Col>
        </Row>

        <Button loading={loading} type='submit' color='primary'>
          {t(shearing ? 'common.save' : 'common.add')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default ShearingForm;
