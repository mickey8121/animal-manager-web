import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik, FormikProvider, Form } from 'formik';
import { Row, Col } from 'reactstrap';

import { toast } from 'react-hot-toast';

import Button from 'components/common/buttons/Button';
import Input from 'components/common/form/Input';
import SelectField from 'components/common/form/SelectField';
import EditorField from 'components/common/form/EditorField';

import useAnimalOptions from 'hooks/animals/useAnimalOptions';
// import { useAnimalQuery } from 'generated/graphql';
// import { useParams } from 'react-router-dom';
// import useUpdateAnimal from 'hooks/animals/useUpdateAnimal';

type OnSubmit = (values: Record<string, string>) => void;

const AnimalSaleForm: FC = () => {
  const { t } = useTranslation();
  // const { animalId } = useParams<{ animalId: string }>();
  // const { data: { animal } = {}, loading: animalQueryLoading } = useAnimalQuery({
  //   variables: { where: { id: animalId } },
  // });
  // const { updateAnimal, loading: updateAnimalLoading } = useUpdateAnimal();

  // const loading = useMemo(
  //   () => animalQueryLoading || updateAnimalLoading,
  //   [animalQueryLoading, updateAnimalLoading],
  // );

  const loading = false;

  const onSubmit: OnSubmit = useCallback(() => toast('Coming soon ;)'), []);

  const formik = useFormik({
    initialValues: {},
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
  });

  const { forSaleStatusOptions } = useAnimalOptions();

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={6}>
            <Input
              id='contactDetails'
              name='contactDetails'
              label={t('animals.contactDetails')}
              placeholder={t('animals.contactDetails')}
              maxLength={50}
            />
          </Col>
          <Col xs={12} md={6}>
            <SelectField
              name='saleStatus'
              options={forSaleStatusOptions}
              label={t('animals.saleStatus')}
              isSearchable={false}
              openMenuOnFocus
            />
          </Col>
        </Row>

        <EditorField
          name='alpacaDetails'
          label={t('animals.alpacaDetails')}
          placeholder={t('animals.alpacaDetails')}
        />

        <Button loading={loading} type='submit' color='primary'>
          {t('common.save')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default AnimalSaleForm;
