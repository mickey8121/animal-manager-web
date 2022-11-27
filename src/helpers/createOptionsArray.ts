import { Option } from 'components/common/select/Select';

const createOptionsArray = (values: string[]): Option[] =>
  values.map(value => ({ value, label: value }));

export default createOptionsArray;
