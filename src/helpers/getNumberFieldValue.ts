import isNaN from 'lodash/isNaN';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getNumberFieldValue = (value: any): number | string => {
  const numberValue = parseInt(value, 10);

  if (isNaN(numberValue)) return '';

  return numberValue;
};

export default getNumberFieldValue;
