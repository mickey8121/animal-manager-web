import { FC, useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-hot-toast';
import * as yup from 'yup';

import { Row, Col } from 'reactstrap';
import { Form, useFormik, FormikProvider } from 'formik';

import Button from 'components/common/buttons/Button';

import PasswordInput from 'components/auth/PasswordInput';
import { password } from 'components/auth/validation';

import { useChangePasswordMutation } from 'generated/graphql';

const ChangePasswordForm: FC = () => {
  const { t } = useTranslation();
  const [isTouched, setIsTouched] = useState(false);
  const [changePassword, { loading }] = useChangePasswordMutation();

  const onSubmit = useCallback(
    ({ currentPassword, newPassword }) => {
      void toast.promise(
        changePassword({
          variables: { data: { oldPassword: currentPassword, password: newPassword } },
        }),
        {
          loading: t('common.updating'),
          success: t('common.successUpdate', { item: t('common.data'), ruEnding: 'ы' }),
          error: t('common.errorUpdate'),
        },
      );
    },
    [changePassword, t],
  );

  const formik = useFormik({
    initialValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
    validationSchema: yup.object().shape({
      currentPassword: password,
      newPassword: password,
      confirmNewPassword: yup.string().when('newPassword', {
        is: (val: string) => val && val.length > 0,
        then: yup.string().oneOf([yup.ref('newPassword')], t('auth.passwordTheSame')),
      }),
    }),
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
    validateOnChange: isTouched,
  });

  const { handleSubmit, touched } = formik;

  useEffect(() => {
    if (touched) setIsTouched(true);
  }, [touched]);

  return (
    <FormikProvider value={formik}>
      <Form className='form change-form' onSubmit={handleSubmit}>
        <h3 className='form-heading'>{t('auth.changePassword')}</h3>
        <Row>
          <Col>
            <PasswordInput name='currentPassword' />
          </Col>
        </Row>
        <Row>
          <Col>
            <PasswordInput name='newPassword' />
          </Col>
        </Row>
        <Row>
          <Col>
            <PasswordInput name='confirmNewPassword' />
          </Col>
        </Row>
        <Button loading={loading} type='submit' color='primary'>
          {t('common.save')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default ChangePasswordForm;
