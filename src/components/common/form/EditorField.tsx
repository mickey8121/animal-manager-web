import { FC, useMemo } from 'react';

import { Field, FieldProps } from 'formik';
import { EditorState } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';

import Editor from 'components/common/Editor';

interface Props extends Omit<EditorProps, 'onChange'> {
  name: string;
  label: string;
  placeholder: string;
  initialValue?: EditorState;
}

const EditorField: FC<Props> = ({ name, ...props }) => {
  const initialValue = useMemo(
    () => (props.initialValue || {}) as EditorState,
    [props.initialValue],
  );

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div>
          <Editor {...field} {...props} initialValue={initialValue} />
          {meta.touched && meta.error && <div className='error'>{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};

export default EditorField;
