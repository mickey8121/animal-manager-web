import { FC, useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { isEqual } from 'lodash';
import { toast } from 'react-hot-toast';

import { Row, Col } from 'reactstrap';
import { Form, useFormik, FormikProvider } from 'formik';

import Input from 'components/common/form/Input';
import EditorField from 'components/common/form/EditorField';
import Button from 'components/common/buttons/Button';

import schema from 'components/profile/validation';

import useUpdateUser from 'hooks/user/useUpdateUser';
import useUser from 'hooks/user/useUser';
import useEditorState from 'hooks/useEditorState';

import { PHONE_PLACEHOLDER } from 'helpers/constants';

const BreederForm: FC = () => {
  const { t } = useTranslation();
  const { updateUser, loading } = useUpdateUser();
  const user = useUser();
  const { convertEditorStateToString, formatEditorStateToJs, getCurrentEditorState } =
    useEditorState();

  const initialValues = useMemo(
    () => ({
      email: user?.breederProfile?.email || '',
      phone: user?.breederProfile?.phone || '',
      bio: getCurrentEditorState(user?.breederProfile?.bio),
    }),
    [getCurrentEditorState, user],
  );

  const onSubmit = useCallback(
    data => {
      if (
        !isEqual(
          { ...data, bio: formatEditorStateToJs(data.bio) },
          { ...initialValues, bio: formatEditorStateToJs(initialValues.bio) },
        )
      ) {
        const { email: breederEmail, phone: breederPhone, bio: breederBio } = data;

        void toast.promise(
          updateUser({
            breederEmail,
            breederPhone,
            breederBio: convertEditorStateToString(breederBio),
          }),
          {
            loading: t('common.updating'),
            success: t('common.successUpdate', { item: t('profile.profile') }),
            error: t('common.errorUpdate'),
          },
        );
      } else {
        toast.success(t('common.successUpdate', { item: t('profile.profile') }));
      }
    },
    [convertEditorStateToString, formatEditorStateToJs, initialValues, t, updateUser],
  );

  const formik = useFormik({
    initialValues,
    validationSchema: schema.breeder,
    onSubmit,
    validateOnMount: false,
    validateOnBlur: false,
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form className='form breeder-form' onSubmit={handleSubmit}>
        <h3 className='form-heading'>{t('profile.breederProfile')}</h3>

        <Row>
          <Col xs={12} md={6}>
            <Input
              id='email'
              type='email'
              name='email'
              label={t('profile.contactEmail')}
              placeholder='email@example.com'
            />
          </Col>
          <Col xs={12} md={6}>
            <Input
              id='phone'
              type='tel'
              name='phone'
              label={t('profile.contactPhone')}
              placeholder={PHONE_PLACEHOLDER}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <EditorField
              label={t('profile.breederBio')}
              name='bio'
              initialValue={initialValues.bio}
              placeholder={t('profile.breederBio')}
            />
          </Col>
        </Row>
        <Row>
          <Col />
        </Row>
        <Button loading={loading} type='submit' color='primary'>
          {t('common.save')}
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default BreederForm;
