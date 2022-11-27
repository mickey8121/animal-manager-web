import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';

const getObjectDifference = <T extends Record<string, unknown>>(
  originalObject: T,
  newObject: T,
): T | null => {
  const sameProperties: string[] = [];

  Object.entries(originalObject).forEach(original => {
    Object.entries(newObject).forEach(newObj => {
      if (original[0] === newObj[0]) {
        if (original[1] === newObj[1]) sameProperties.push(newObj[0]);
      }
    });
  });

  const objectDifference: T = omit(newObject, sameProperties) as T;

  if (isEmpty(objectDifference)) return null;

  return objectDifference;
};

export default getObjectDifference;
