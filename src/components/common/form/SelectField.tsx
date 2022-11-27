import { FC } from 'react';

import { useField } from 'formik';

import classnames from 'classnames';

import { Props as ReactSelectProps } from 'react-select';

import Select, { Option } from 'components/common/select/Select';
import InputSkeleton from 'components/common/skeletons/form/InputSkeleton';

import { Maybe } from 'graphql/jsutils/Maybe';

interface Props extends Omit<ReactSelectProps, 'value'> {
  options: Option[];
  name: string;
  label?: string;
  initialValue?: Maybe<string>;
  loading?: boolean;
}

const SelectField: FC<Props> = ({ name, loading, ...props }) => {
  const [field, { error, touched }] = useField(name);

  if (loading) return <InputSkeleton />;

  return (
    <Select {...field} {...props} className={classnames({ 'is-invalid': !!error && touched })}>
      {error && touched && (
        <div className={classnames('invalid-feedback', { active: !!error })}>{error}</div>
      )}
    </Select>
  );
};

export default SelectField;
