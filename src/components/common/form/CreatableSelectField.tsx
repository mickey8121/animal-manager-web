import { FC } from 'react';

import { useField } from 'formik';

import classnames from 'classnames';

import { Props as ReactSelectProps } from 'react-select';

import CreatableSelect from 'components/common/select/CreatableSelect';
import InputSkeleton from 'components/common/skeletons/form/InputSkeleton';

import { Option } from 'components/common/select/Select';

interface Props extends Omit<ReactSelectProps, 'value'> {
  options: Option[];
  name: string;
  label?: string;
  loading?: boolean;
}

const CreatableSelectField: FC<Props> = ({ name, loading, ...props }) => {
  const [field, { error, touched }] = useField(name);

  if (loading) return <InputSkeleton />;

  return (
    <CreatableSelect
      {...field}
      {...props}
      error={error}
      className={classnames({ 'is-invalid': !!error && touched })}
    >
      {error && touched && (
        <div className={classnames('invalid-feedback', { active: !!error })}>{error}</div>
      )}
    </CreatableSelect>
  );
};

export default CreatableSelectField;
