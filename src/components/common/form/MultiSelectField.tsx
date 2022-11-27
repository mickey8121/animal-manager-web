import { FC } from 'react';

import { useField } from 'formik';

import classnames from 'classnames';

import { Props as ReactSelectProps } from 'react-select';

import { Option } from 'components/common/select/Select';
import MultiSelect from 'components/common/select/MultiSelect';

interface Props extends Omit<ReactSelectProps, 'options'> {
  name: string;
  label?: string;
  options: Option[];
}

const MultiSelectField: FC<Props> = ({ name, ...props }) => {
  const [field, { error, touched }] = useField(name);

  return (
    <MultiSelect {...field} {...props} className={classnames({ 'is-invalid': !!error && touched })}>
      {error && touched && (
        <div className={classnames('invalid-feedback', { active: error })}>{error}</div>
      )}
    </MultiSelect>
  );
};

export default MultiSelectField;
