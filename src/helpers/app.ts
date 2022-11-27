import { camelCase, mapKeys } from 'lodash';

const app = ((): Record<string, string | undefined> => {
  return mapKeys(process.env, (value, key) => {
    return camelCase(key?.replace?.('REACT_APP_', ''));
  });
})();

export default app;
