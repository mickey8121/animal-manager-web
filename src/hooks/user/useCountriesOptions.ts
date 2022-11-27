import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { camelCase } from 'lodash';

import { Option } from 'components/common/select/Select';

import { COUNTRIES } from 'helpers/constants';

const useCountriesOptions = (): Option[] => {
  const { t } = useTranslation();

  return useMemo(
    () =>
      COUNTRIES.map(country => {
        return { ...country, label: t(`countries.${camelCase(country.label)}`) };
      }),
    [t],
  );
};

export default useCountriesOptions;
