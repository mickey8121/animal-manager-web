import { FC, useCallback, useMemo } from 'react';

import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider, Form } from 'formik';

import { isEqual } from 'lodash';
import { toast } from 'react-hot-toast';

import { Row, Col } from 'reactstrap';

import Button from 'components/common/buttons/Button';
import Input from 'components/common/form/Input';

import useUpdateAnimal from 'hooks/animals/animal/useUpdateAnimal';
import useAnimalFromProvider from 'hooks/animals/animal/useAnimalFromProvider';

import {
  AlpacaProfile,
  AlpacaProfileInput,
  AnimalProfileFragmentFragment,
} from 'generated/graphql';

const AnimalAanzForm: FC = () => {
  const { t } = useTranslation();
  const { animalId } = useParams<{ animalId: string }>();

  const { animal, loading: animalLoading } = useAnimalFromProvider();

  const { updateAnimal, loading: updateAnimalLoading } = useUpdateAnimal();

  const loading = useMemo(
    () => animalLoading || updateAnimalLoading,
    [animalLoading, updateAnimalLoading],
  );

  const initialValues = useMemo<Omit<AlpacaProfile, 'id'>>(() => {
    const animalProfile = (animal as AnimalProfileFragmentFragment)?.profile as AlpacaProfile;

    return {
      aanzHerdId: animalProfile?.aanzHerdId ?? '',
      aanzHerdName: animalProfile?.aanzHerdName ?? '',
      aanzIar: animalProfile?.aanzIar ?? '',
      aanzName: animalProfile?.aanzName ?? '',
    };
  }, [animal]);

  const onSubmit = useCallback(
    (data: AlpacaProfileInput): void => {
      if (!isEqual(initialValues, data)) {
        void toast.promise(updateAnimal({ alpacaProfile: {} }, animalId), {
          loading: t('common.saving'),
          success: t('common.successSaving', { item: t('animals.profile') }),
          error: t('common.errorSaving'),
        });
      } else {
        toast.success(t('common.successSaving', { item: t('animals.profile') }));
      }
    },
    [t, animalId, initialValues, updateAnimal],
  );

  const formik = useFormik({
    initialValues,
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={6}>
            <Input
              id='aanzIar'
              name='aanzIar'
              label={t('animals.aanzIar')}
              placeholder={t('animals.aanzIar')}
              maxLength={50}
            />
          </Col>
          <Col xs={12} md={6}>
            <Input
              id='aanzHerdName'
              name='aanzHerdName'
              label={t('animals.aanzHerdName')}
              placeholder={t('animals.aanzHerdName')}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Input
              id='aanzName'
              name='aanzName'
              label={t('animals.aanzName')}
              placeholder={t('animals.aanzName')}
            />
          </Col>
          <Col xs={12} md={6}>
            <Input
              id='aanzHerdId'
              name='aanzHerdId'
              label={t('animals.aanzHerdId')}
              placeholder={t('animals.aanzHerdId')}
            />
          </Col>
        </Row>

        <Button loading={loading} type='submit' color='primary'>
          {t('common.save')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default AnimalAanzForm;
