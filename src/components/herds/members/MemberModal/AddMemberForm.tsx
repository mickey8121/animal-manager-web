import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { useFormik, Form, FieldArray, FormikProvider } from 'formik';

import { toast } from 'react-hot-toast';
import uniqueId from 'lodash/uniqueId';

import Button from 'components/common/buttons/Button';
import Input from 'components/common/form/Input';
import validationSchema from 'components/herds/members/MemberModal/validation';

import useInviteHerdMember from 'hooks/herds/members/useInviteHerdMember';

import { HerdFragmentFragment } from 'generated/graphql';

interface Props {
  herd?: HerdFragmentFragment;
}

interface Email {
  id: string;
  email: string;
}

const AddMemberForm: FC<Props> = ({ herd }) => {
  const { t } = useTranslation();
  const { inviteMember, loading } = useInviteHerdMember();
  const { id: herdId } = herd || {};

  const onSubmit = (emails: Email[]): void => {
    if (herdId) {
      const promises = emails.map(({ email }) => inviteMember(herdId, email));

      void toast.promise(Promise.all(promises), {
        loading: t('common.adding'),
        success: t('common.successAdd', { item: t('members.members') }),
        error: t('common.errorAdd'),
      });
    }
  };

  const formik = useFormik({
    validationSchema,
    initialValues: { emails: [{ id: uniqueId(), email: '' }] },
    onSubmit: ({ emails }) => {
      onSubmit(emails);
      formik.resetForm();
    },
    validateOnMount: false,
    validateOnBlur: false,
  });

  const {
    values: { emails },
    handleSubmit,
    handleChange,
  } = formik;

  return (
    <div className='members-add-form'>
      <h3 className='title-members-add'>{t('members.inviteNewMembers')}</h3>
      <FormikProvider value={formik}>
        <Form onSubmit={handleSubmit}>
          <FieldArray
            name='emails'
            render={arrayHelpers => (
              <div className='email form-group'>
                {emails.map(({ id, email }, index) => (
                  <Input
                    key={id}
                    autoFocus
                    placeholder='email@example.com'
                    type='email'
                    id={id}
                    onChange={handleChange}
                    value={email}
                    name={`emails.[${index}].email`}
                  />
                ))}
                <div className='buttons-form-group'>
                  {emails.length < 4 ? (
                    <Button
                      type='button'
                      className='btn-link btn-transparent'
                      onClick={() => arrayHelpers.push({ id: uniqueId(), email: '' })}
                    >
                      {`+ ${t('members.addNewMembers')}`}
                    </Button>
                  ) : null}
                  <Button
                    loading={loading}
                    type='submit'
                    className='btn btn-primary'
                    color='primary'
                  >
                    {t('members.invite')}
                  </Button>
                </div>
              </div>
            )}
          />
        </Form>
      </FormikProvider>
    </div>
  );
};

export default AddMemberForm;
