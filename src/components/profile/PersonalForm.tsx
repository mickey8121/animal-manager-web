import { FC, useMemo, useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import i18n from 'startup/i18next';
import { toast } from 'react-hot-toast';
import { isEqual } from 'lodash';

import { Row, Col } from 'reactstrap';
import { Form, useFormik, FormikProvider } from 'formik';

import Input from 'components/common/form/Input';
import SelectField from 'components/common/form/SelectField';
import Button from 'components/common/buttons/Button';

import schema from 'components/profile/validation';

import useCountriesOptions from 'hooks/user/useCountriesOptions';
import useUpdateUser from 'hooks/user/useUpdateUser';
import useUser from 'hooks/user/useUser';

import { LANGUAGES } from 'helpers/constants';

const PersonalForm: FC = () => {
  const { t } = useTranslation();
  const user = useUser();
  const { updateUser, loading } = useUpdateUser();
  const countriesOptions = useCountriesOptions();

  const initialValues = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      city: user?.city || '',
      country: user?.country || 'NZ',
      language: user?.language || i18n.language || window.localStorage.i18nextLng,
    }),
    [user],
  );

  const onSubmit = useCallback(
    data => {
      if (!isEqual(data, initialValues)) {
        void toast.promise(updateUser(data), {
          loading: t('common.updating'),
          success: t('common.successUpdate', {
            item: t('profile.profile'),
          }),
          error: t('common.errorUpdate'),
        });
      } else {
        toast.success(t('common.successUpdate', { item: t('profile.profile') }));
      }
    },
    [initialValues, t, updateUser],
  );

  const formik = useFormik({
    initialValues,
    validationSchema: schema.profile,
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form className='form personal-form' onSubmit={handleSubmit}>
        <h3 className='form-heading'>{t('profile.personalProfile')}</h3>
        <Row>
          <Col xs={12} md={6}>
            <Input
              id='firstName'
              name='firstName'
              label={t('auth.firstName')}
              placeholder={t('auth.firstName')}
              maxLength={30}
            />
          </Col>
          <Col xs={12} md={6}>
            <Input
              id='lastName'
              name='lastName'
              label={t('auth.lastName')}
              placeholder={t('auth.lastName')}
              maxLength={30}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Input
              id='city'
              name='city'
              label={t('profile.city')}
              placeholder={t('profile.city')}
              maxLength={30}
            />
          </Col>
          <Col xs={12} md={6}>
            <SelectField
              name='country'
              options={countriesOptions}
              label={t('profile.country')}
              initialValue={initialValues.country}
              openMenuOnFocus
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <SelectField
              name='language'
              options={LANGUAGES}
              label={t('profile.language')}
              initialValue={initialValues.language}
              isSearchable={false}
              openMenuOnFocus
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

export default PersonalForm;
