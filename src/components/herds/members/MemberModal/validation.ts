import * as yup from 'yup';
import i18n from 'startup/i18next';

const t = i18n.getFixedT(i18n.language);

type Errors = string | yup.ValidationError | yup.ValidationError[];

// eslint-disable-next-line func-names
yup.addMethod(yup.array, 'uniqueProperty', function (propertyPath, message) {
  // eslint-disable-next-line func-names
  return this.test('unique', '', function (list) {
    const errors: Errors = [];

    list?.forEach((item, index) => {
      const propertyValue = item[propertyPath];

      if (propertyValue && list.filter(email => email[propertyPath] === propertyValue).length > 1) {
        errors.push(
          this.createError({
            path: `${this.path}.[${index}].${propertyPath}`,
            message,
          }),
        );
      }
    });

    if (errors) {
      throw new yup.ValidationError(errors);
    }

    return true;
  });
});

const validationSchema = yup.object().shape({
  emails: yup
    .array()
    .of(
      yup.object().shape({
        email: yup.string().email(t('auth.emailInvalid')).required(t('auth.emailRequired')),
      }),
    )
    // Case: Used to avoid using declare module 'yup'
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .uniqueProperty('email', t('members.sameMembers'))
    .max(4, 'Maximum of inputs'),
});

export default validationSchema;
